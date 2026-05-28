'use client'

import { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Biến global để giữ instance WASM tránh khởi tạo lại nhiều lần gây lỗi memory
let globalOpenSCAD: any = null;
let initPromise: Promise<any> | null = null;

async function loadOpenSCAD() {
  if (globalOpenSCAD) return globalOpenSCAD;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log("[WASM] Đang tải module OpenSCAD...");
      // @ts-ignore
      const mod = await import('openscad-wasm');
      
      // Xử lý các kiểu export khác nhau của gói openscad-wasm
      const modAny = mod as any;
      let factory = modAny.default ?? modAny;
      if (factory.default) factory = factory.default;

      if (typeof factory !== 'function') {
        throw new Error("Không thể tìm thấy hàm khởi tạo OpenSCAD trong module.");
      }

      const instance = await factory({
        noInitialRun: true,
        print: (text: string) => console.log(`[OpenSCAD STDOUT] ${text}`),
        printErr: (text: string) => console.error(`[OpenSCAD STDERR] ${text}`),
      });

      globalOpenSCAD = instance;
      console.log("[WASM] OpenSCAD đã sẵn sàng.");
      return instance;
    } catch (err) {
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

export function AIGeneratedObject({ scadCode, color }: { scadCode?: string, color: string }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Tạo ID duy nhất cho mỗi instance để tránh ghi đè file ảo trong WASM
  const instanceId = useMemo(() => Math.random().toString(36).substring(2, 9), []);

  useEffect(() => {
    if (!scadCode) return;

    let isMounted = true;
    setError(null);

    async function runCompile() {
      try {
        const instance = await loadOpenSCAD();
        const scadFileName = `/input_${instanceId}.scad`;
        const stlFileName = `/output_${instanceId}.stl`;

        console.log(`[AIGeneratedObject ${instanceId}] Đang biên dịch mã SCAD...`);
        
        // 1. Viết mã nguồn vào filesystem ảo
        instance.FS.writeFile(scadFileName, scadCode);
        
        // 2. Thực thi lệnh biên dịch (Sử dụng lệnh callMain đồng bộ của Emscripten)
        // Chú ý: OpenSCAD WASM cần các tham số dòng lệnh
        instance.callMain(['-o', stlFileName, scadFileName]);
        
        // 3. Đọc kết quả
        if (!instance.FS.analyzePath(stlFileName).exists) {
          throw new Error("Biên dịch thất bại: Không tìm thấy file STL đầu ra.");
        }

        const stlBuffer = instance.FS.readFile(stlFileName);
        
        if (!isMounted) return;

        // 4. Parse STL sang Three.js
        const loader = new STLLoader();
        const geo = loader.parse(stlBuffer.buffer);
        geo.computeVertexNormals();
        
        // Tự động chuẩn hóa kích thước và vị trí
        geo.computeBoundingBox();
        const box = geo.boundingBox;
        if (box) {
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);
          
          // Căn giữa
          geo.translate(-center.x, -center.y, -center.z);
          
          // Scale về kích thước chuẩn (2 đơn vị)
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scaleFactor = 2 / maxDim;
            geo.scale(scaleFactor, scaleFactor, scaleFactor);
          }
          
          // Đặt chân lên mặt sàn
          geo.computeBoundingBox();
          if (geo.boundingBox) {
            geo.translate(0, -geo.boundingBox.min.y, 0);
          }
        }

        console.log(`[AIGeneratedObject ${instanceId}] Thành công.`);
        setGeometry(geo);

        // Dọn dẹp file ảo để giải phóng RAM
        try {
          instance.FS.unlink(scadFileName);
          instance.FS.unlink(stlFileName);
        } catch (e) {}

      } catch (err: any) {
        console.error(`[AIGeneratedObject ${instanceId}] Lỗi:`, err);
        if (isMounted) setError(err.message);
      }
    }

    runCompile();

    return () => { isMounted = false; };
  }, [scadCode, instanceId]);

  if (error) {
    // Hiển thị một khối đỏ nhỏ nếu bị lỗi để user biết
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
    );
  }

  if (!geometry) {
    // Hiển thị một khối xoay nhẹ khi đang load
    return (
      <mesh rotation={[Date.now() * 0.001, Date.now() * 0.001, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#888" transparent opacity={0.5} />
      </mesh>
    );
  }

  return (
    <mesh castShadow receiveShadow geometry={geometry}>
      <meshStandardMaterial 
        color={color} 
        roughness={0.6} 
        metalness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
}
