# Roadmap Dự Án: 3D Room Studio

Tài liệu này vạch ra lộ trình phát triển chi tiết cho dự án 3D Room Studio, được chia thành các Giai đoạn (Phases) với mức độ ưu tiên rõ ràng.

## Tổng quan Phân loại Tính năng (Feature Priorities)

*   **MVP (Minimum Viable Product) / Core Features (P0 & P1):**
    *   Xác thực người dùng (Auth) & Quản lý dự án cơ bản (CRUD).
    *   3D Canvas cốt lõi: Render phòng, Camera (OrbitControls), Grid.
    *   Tương tác vật thể: Thêm, xóa, chọn (Raycast), Di chuyển/Xoay/Scale (TransformControls).
    *   Thay đổi màu sắc vật thể.
    *   Đồng bộ dữ liệu: Save/Load trạng thái (Entities) với Supabase DB.
    *   AI Studio: Text-to-3D (Sinh mô hình từ prompt).
    *   Giao diện Editor chuẩn shadcn/ui (Dark-first).
    *   Xuất file .glb.

*   **Advanced Features (P2):**
    *   Tạo Thumbnail tự động (snapshot Canvas).
    *   Hỗ trợ phím tắt (Keyboard shortcuts: Undo/Redo, Delete...).

*   **Future Features (P3 - Stretch Goals):**
    *   Liên kết nhiều phòng (Multi-room routing / Portals).
    *   Realtime Collaboration (Nhiều người cùng chỉnh sửa).

---

## Chi tiết Lộ trình Phát triển (Phases)

### Phase 1: Infrastructure & DB Foundation (Nền tảng Hạ tầng)
*   **Mục tiêu:** Thiết lập xong khung dự án, cơ sở dữ liệu và môi trường triển khai cơ bản.
*   **Danh sách Task:**
    *   Khởi tạo Next.js 14 (App Router) với TypeScript, Tailwind CSS v4.
    *   Tạo dự án Supabase, thiết lập cấu hình kết nối.
    *   Thiết kế và tạo các bảng trong Database (`users`, `projects`, `rooms`, `entities`, `ai_logs`).
    *   Viết và áp dụng RLS (Row Level Security) Policies cho tất cả các bảng.
    *   Thiết lập Dockerfile và `docker-compose.yml` cho môi trường development/production.
*   **Expected Output:**
    *   Project chạy được `npm run dev`.
    *   Schema Database hoàn chỉnh trên Supabase với RLS hoạt động đúng (minh chứng qua SQL script hoặc giao diện Supabase).
    *   Có thể dùng Postman để test API
    *   Chạy thành công lệnh `docker compose up`.

### Phase 2: Auth & Project Management (Xác thực & Quản lý)
*   **Mục tiêu:** Xây dựng luồng người dùng hoàn chỉnh từ đăng nhập đến vào không gian làm việc.
*   **Danh sách Task:**
    *   Tích hợp Supabase Auth (Đăng ký, Đăng nhập, Đăng xuất).
    *   Thiết lập Next.js Middleware để bảo vệ các route yêu cầu đăng nhập (`/dashboard`, `/editor`).
    *   Xây dựng trang Dashboard: Hiển thị danh sách dự án của user.
    *   Chức năng Tạo mới, Xóa dự án (CRUD cơ bản).
*   **Expected Output:**
    *   Người dùng có thể tạo tài khoản và đăng nhập.
    *   Chỉ truy cập được Dashboard khi đã đăng nhập.
    *   Tạo và thấy dự án của mình (lưu xuống bảng `projects`).

### Phase 3: 3D Engine Core (Cốt lõi Đồ họa 3D)
*   **Mục tiêu:** Khởi tạo không gian 3D nền tảng có thể tương tác cơ bản.
*   **Danh sách Task:**
    *   Cài đặt Three.js, React Three Fiber (R3F) và `@react-three/drei`.
    *   Khởi tạo `Canvas` component.
    *   Thiết lập hệ thống Camera (isometric angle 45 độ), `OrbitControls` (xoay, zoom, pan).
    *   Thiết lập Ánh sáng (Ambient, Directional) và Đổ bóng (Shadows).
    *   Tạo lưới tham chiếu (Grid / GridHelper).
    *   Cài đặt Raycasting cơ bản để bắt sự kiện click trong không gian 3D.
*   **Expected Output:**
    *   Hiển thị được không gian 3D có sàn, tường và lưới.
    *   Có thể dùng chuột để xoay và zoom không gian.

### Phase 4: Editor & Interactions (Công cụ Chỉnh sửa)
*   **Mục tiêu:** Biến 3D Canvas thành một Editor thực thụ, cho phép người dùng thao tác với đồ vật.
*   **Danh sách Task:**
    *   Thiết lập Zustand store để quản lý State của Editor (vật thể đang chọn, chế độ view...).
    *   Xây dựng Thư viện đồ vật (Component Library): Ít nhất 5 loại (Bàn, Ghế, v.v.) dùng code Three.js (parametric).
    *   Tích hợp `TransformControls`: Xử lý logic di chuyển (Translate), xoay (Rotate), thay đổi kích thước (Scale).
    *   Xây dựng Bảng thuộc tính (Properties Panel) bên phải: Hiển thị và chỉnh sửa tọa độ, màu sắc vật thể.
    *   Highlight vật thể đang được chọn (OutlineEffect).
*   **Expected Output:**
    *   Kéo thả hoặc click để thêm đồ vật từ thư viện vào không gian.
    *   Click chọn đồ vật -> hiển thị Transform gizmo và thông tin trên Properties Panel.
    *   Đổi màu, xoay, di chuyển đồ vật mượt mà.

### Phase 5: Data Sync (Đồng bộ Dữ liệu)
*   **Mục tiêu:** Lưu trữ vĩnh viễn các thay đổi của người dùng lên Cloud.
*   **Danh sách Task:**
    *   Viết logic Serialize trạng thái Scene (lấy mảng `entities` từ Zustand) -> JSON.
    *   Gọi API (Supabase client) để Insert/Update/Delete bảng `entities`.
    *   Áp dụng kỹ thuật `debounce` (300ms) cho các sự kiện `onObjectChange` để tránh spam database.
    *   Viết logic Deserialize: Khi mở `/editor/[id]`, fetch dữ liệu từ bảng `entities` và render lại vào Scene.
*   **Expected Output:**
    *   F5 lại trang hoặc mở dự án vào hôm sau, các đồ vật, vị trí, màu sắc vẫn được giữ nguyên.

### Phase 6: AI Assist Text-to-3D (Trợ lý Sinh Mô Hình 3D)
*   **Mục tiêu:** Xây dựng hệ thống trợ lý AI cho phép người dùng sinh mô hình 3D trực tiếp từ text prompt sử dụng LLM và OpenSCAD WASM.
*   **Danh sách Task:**
    *   **6.1 API Luân Phiên (Multi-Model):** Xây dựng API Route (`/api/generate-scad`) gọi mô hình ngôn ngữ (Gemini 2.0 Flash) để sinh code OpenSCAD. Triển khai cơ chế fallback sang mô hình Grok nếu Gemini bị lỗi (hoặc ngược lại).
    *   **6.2 Compile OpenSCAD WASM:** Tích hợp package `openscad-wasm` (lazy load) trên trình duyệt để biên dịch mã SCAD nhận được từ API thành định dạng `.stl`.
    *   **6.3 Three.js Integration:** Parse file `.stl` bằng `STLLoader`, tự động căn giữa, scale cho phù hợp và thêm `THREE.Mesh` sinh ra vào Scene hiện tại.
    *   **6.4 Cập Nhật Database & UI:** Bổ sung trường `scad_code` và `prompt` vào bảng `entities`. Tạo bảng `ai_history` lưu lịch sử prompt. Xây dựng component `AIAssistPanel` trên giao diện Editor.
*   **Expected Output:**
    *   Người dùng có thể gõ prompt bằng tiếng Việt (ví dụ: "ghế sofa màu xám") và nhận được mô hình 3D sau vài giây ngay trong trình duyệt mà không cần cloud storage cho file 3D.
    *   Lịch sử sinh mô hình được lưu lại và hiển thị trên panel AI.
    *   Hệ thống có khả năng dự phòng (fallback) tự động giữa 2 mô hình AI (Gemini/Grok) để đảm bảo độ tin cậy.

### Phase 7: UI Polish & Deployment (Hoàn thiện & Triển khai)
*   **Mục tiêu:** Trau chuốt giao diện người dùng và đưa sản phẩm lên môi trường thực tế.
*   **Danh sách Task:**
    *   Đồng bộ toàn bộ UI theo chuẩn Dark-first (#0F1117), sử dụng shadcn/ui components (Dialog, Button, Input...).
    *   Thêm các hiệu ứng mượt mà bằng Framer Motion (Panel slide-in, Toast notifications bằng `sonner`).
    *   Phát triển tính năng Xuất file (Export to .glb) dùng `GLTFExporter`.
    *   Kiểm tra toàn diện responsive layout (chỉ hỗ trợ Desktop/Tablet ngang).
    *   Deploy lên VPS (Ubuntu): Cấu hình Nginx reverse proxy chỉ tới Docker container (port 3000).
    *   Cài đặt SSL (Certbot/Let's Encrypt) cho Domain thực.
*   **Expected Output:**
    *   Giao diện mượt mà, đúng thiết kế (không lỗi CSS).
    *   Tải thành công file .glb về máy tính.
    *   Truy cập được ứng dụng từ internet qua `https://your-domain.com`.