# Technical Specification: 3D Room Studio

## 1. Tổng quan dự án (Project Overview)
**3D Room Studio** là một ứng dụng web (Web Application) cung cấp môi trường không gian 3D tương tác trực tiếp trên trình duyệt. Ứng dụng cho phép người dùng khởi tạo, tinh chỉnh và quản lý các không gian nội thất (phòng đơn, căn hộ) bằng cách kéo thả và tùy biến các vật thể 3D.

Lấy cảm hứng từ nền tảng Rooms.xyz nhưng được định hướng mở rộng hơn, dự án không chỉ dừng lại ở một căn phòng đơn lẻ mà hỗ trợ liên kết đa phòng, đồng thời tích hợp sâu công nghệ AI (Text-to-3D) nhằm tối ưu hóa quá trình sáng tạo nội dung 3D (UGC) của người dùng phổ thông và nhà thiết kế.

## 2. Mục tiêu (Goals)
**Mục tiêu sản phẩm:**
* Xây dựng công cụ đồ họa 3D nền web trực quan, có thư viện vật thể (parametric objects) đa dạng.
* Tích hợp mượt mà AI tạo mô hình 3D từ văn bản để giải quyết bài toán thiếu hụt tài nguyên 3D cục bộ.
* Cung cấp khả năng lưu trữ Cloud và đồng bộ hóa trạng thái scene theo thời gian thực.

**Mục tiêu kỹ thuật & Học tập:**
* Làm chủ hệ sinh thái **Next.js 14** (App Router, Server Components/Actions) cùng **TypeScript** nghiêm ngặt.
* Tận dụng tối đa kiến trúc Serverless của **Supabase** (Auth, Database, Storage, RLS, Edge Functions).
* Triển khai môi trường production chuẩn chỉnh thông qua **Docker**, **Nginx**, và triển khai trên **VPS (Ubuntu)** với SSL.

## 3. Minimum Viable Product (MVP)
Phiên bản MVP yêu cầu hoàn thiện và vận hành ổn định các tính năng cốt lõi sau:
1. **Authentication:** Đăng ký, đăng nhập và quản lý phiên làm việc bằng Supabase Auth.
2. **Project CRUD:** Khởi tạo dự án, quản lý không gian và có ít nhất 5 loại đồ vật trong thư viện (Bàn, Ghế, Tủ, Đèn, Trang trí).
3. **Core 3D Canvas:** Tương tác trực tiếp trên giao diện 3D (Di chuyển, xoay, thay đổi kích thước, đổi màu vật thể).
4. **Data Persistence:** Serialize/Deserialize trạng thái của Scene và lưu/tải thành công từ Supabase Database.
5. **Security (RLS):** Người dùng chỉ có quyền đọc/ghi trên các không gian và vật thể thuộc sở hữu của mình.
6. **AI Integration:** Sinh thành công mô hình 3D từ prompt văn bản và load trực tiếp vào Canvas.
7. **Deployment:** Đóng gói bằng Docker và truy cập public qua Domain thực, có HTTPS.

## 4. Tech Stack (Công nghệ sử dụng)
* **Frontend Framework:** Next.js 14 (App Router)
* **Ngôn ngữ:** TypeScript (Strict mode)
* **3D Engine:** Three.js + React Three Fiber (R3F) + @react-three/drei
* **UI/Styling:** Tailwind CSS v4 + shadcn/ui + Framer Motion
* **State Management:** Zustand (Local Editor State)
* **Backend / BaaS:** Supabase
  * *Auth:* Quản lý người dùng.
  * *Database (PostgreSQL):* Lưu trữ Projects & Entities.
  * *Storage:* Lưu trữ file `.glb` (AI generated) và thumbnail `.png`.
  * *Edge Functions:* Xử lý proxy API calls (tránh lộ API Key).
* **AI Provider:** Meshy.ai API (Text-to-3D) / Hỗ trợ dev: ChatGPT, Claude, Gemini.
* **Infrastructure:** Docker, Docker Compose, VPS (Ubuntu), Nginx (Reverse Proxy), Certbot (SSL).

## 5. Kiến trúc tổng thể (System Architecture)
Hệ thống sử dụng kiến trúc **Client-Serverless**, loại bỏ Backend truyền thống, giao tiếp trực tiếp với BaaS (Supabase) thông qua Client/Server Components của Next.js:

```text
Browser (Next.js 14 Client)
 ├── 3D Canvas (React Three Fiber)
 ├── UI Layer (Tailwind + shadcn/ui)
 │
 ├── [Middleware & Server Actions] 
 │    └── Next.js Server (Route Protection, SSR data fetching)
 │
 └── Supabase (BaaS)
      ├── Auth (JWT, Session Management)
      ├── Database (PostgreSQL + RLS Policies)
      ├── Storage (Buckets for .glb / .png)
      └── Edge Functions (Deno / V8)
           └── External API: Meshy.ai (Text-to-3D processing)
```

**Database Schema (Mở rộng & Chi tiết):**
* `auth.users` (Hệ thống mặc định của Supabase): Quản lý thông tin đăng nhập (email, password, OAuth), không cần tự thiết kế.
* `users` (Bảng public lưu thông tin mở rộng của user, có thể gọi là `profiles`): `id` (PK, FK auth.users.id), `email`, `display_name`, `avatar_url`, `created_at`.
* `projects`: `id` (PK), `user_id` (FK users.id), `name`, `description`, `thumbnail_url`, `is_public` (boolean), `created_at`, `updated_at`.
* `rooms` (Hỗ trợ tính năng liên kết nhiều phòng): `id` (PK), `project_id` (FK projects.id), `name`, `room_type`, `environment_settings` (jsonb), `created_at`.
* `entities` (Vật thể 3D): `id` (PK), `room_id` (FK rooms.id), `type` (varchar), `position` (jsonb), `rotation` (jsonb), `scale` (jsonb), `color` (varchar), `metadata` (jsonb - lưu thuộc tính parametric phụ), `created_at`, `updated_at`.
* `room_connections` (Cổng kết nối giữa các phòng): `id` (PK), `from_room_id` (FK rooms.id), `to_room_id` (FK rooms.id), `door_entity_id` (FK entities.id), `created_at`.
* `ai_logs` (Lịch sử Text-to-3D): `id` (PK), `user_id` (FK users.id), `project_id` (FK projects.id), `prompt` (text), `result_url` (text), `status` (varchar - pending/success/error), `created_at`.

## 6. Development Priorities (Ưu tiên phát triển)
Quá trình phát triển được chia theo các giai đoạn (Phases) có tính tuần tự, đảm bảo nền tảng vững chắc trước khi làm giao diện:
1. **Phase 1: Infrastructure & DB Foundation.** Setup Next.js, Supabase, thiết kế Table và viết RLS Policies. Setup Docker environment.
2. **Phase 2: Auth & Project Management.** Hoàn thiện luồng Đăng nhập, Dashboard, tạo/xóa Project.
3. **Phase 3: 3D Engine Core.** Khởi tạo React Three Fiber Canvas, setup Camera (OrbitControls), Ánh sáng, Grid và tính năng Raycasting.
4. **Phase 4: Editor & Interactions.** Thêm TransformControls, Component Library (kéo thả đồ vật), Bảng thuộc tính (Properties Panel) và Zustand store.
5. **Phase 5: Data Sync.** Serialize Scene -> DB và Deserialize DB -> Scene.
6. **Phase 6: AI Integration.** Viết Supabase Edge Function gọi Meshy.ai, xử lý tải file `.glb` vào Canvas.
7. **Phase 7: UI Polish & Deployment.** Tối ưu UI/UX (Animations, Dark mode strict), đẩy lên VPS, config Nginx/SSL.

## 7. Feature Priorities (Ưu tiên tính năng)
* **P0 (Critical/Blocker):**
  * Supabase Auth & DB (RLS bắt buộc).
  * 3D Canvas cơ bản (Render phòng, Camera, Grid).
  * Thêm, xóa, chọn (Raycast) vật thể.
  * Tương tác (Move/Rotate/Scale) qua TransformControls.
  * Save/Load hệ thống vật thể (Entities).
* **P1 (High/Core Value):**
  * Đổi màu sắc vật thể.
  * AI Studio: Sinh 3D từ prompt (Text-to-3D).
  * Giao diện Sidebar, Right Panel chuẩn shadcn/ui.
  * Xuất file `.glb`.
* **P2 (Medium/Enhancement):**
  * Thumbnail tự động (snapshot Canvas).
  * Keyboard shortcuts (Undo/Redo, Delete).
* **P3 (Low/Stretch Goals):**
  * Liên kết nhiều phòng (Multi-room routing).
  * Realtime Collaboration (Supabase Realtime).

## 8. Coding Philosophy (Triết lý lập trình)
* **Tech-aligned:** Tuân thủ chặt chẽ Next.js App Router paradigm. Tách biệt rõ ràng Server Components (fetch dữ liệu trên Dashboard) và Client Components (Canvas, Editor, Interactive UI).
* **Dark-first & Content-first:** 
  * UI chỉ có giao diện Dark Mode (không làm Light mode). Background nền sâu nhất `#0F1117`.
  * Không gian 3D Canvas là trung tâm (chiếm tối thiểu 70% viewport), các thanh công cụ (Sidebar, Panel) là thành phần phụ trợ, có thể ẩn/hiện.
* **Progressive UI:** Giao diện hiển thị theo ngữ cảnh. Chỉ hiển thị Bảng thuộc tính khi có vật thể được chọn.
* **Consistent Design:** Đồng nhất hoàn toàn hệ thống Design Tokens: border-radius (`0.5rem`), micro-interactions (transition `150ms`), opacity, và phân cấp Z-index nghiêm ngặt.
* **Type Safety:** 100% TypeScript strict mode. Định nghĩa rõ Interface cho Database schema và Three.js Component props.

## 9. Những nguyên tắc quan trọng khi phát triển (Key Development Principles)
1. **Nguyên tắc Bảo mật (Security strictness):**
   * Tuyệt đối **không** lưu trữ API Keys của bên thứ 3 (như Meshy.ai) trên Client. Mọi request AI phải đi qua *Supabase Edge Functions*.
   * RLS (Row Level Security) phải được áp dụng trên MỌI bảng dữ liệu (`USING (auth.uid() = user_id)`). Route `/editor/[id]` phải được bảo vệ bởi Next.js Middleware.
2. **Nguyên tắc Hiệu năng 3D (3D Performance):**
   * Sử dụng thuật toán phân loại chiều sâu (Painter's Algorithm) và render back-to-front cho phòng.
   * Để giới hạn số lượng request DB, các thao tác di chuyển/xoay/scale liên tục (`onObjectChange`) trên vật thể phải được **debounce 300ms** trước khi thực hiện PATCH lên Supabase.
   * Giới hạn cảnh báo hiệu năng khi số lượng entity vượt quá 50 (trong phạm vi MVP).
3. **Nguyên tắc UI/UX (shadcn/ui & Tailwind):**
   * Giao diện desktop-only, min-width `1024px` (Không thiết kế mobile cho editor).
   * **Không** edit trực tiếp trong thư mục `/components/ui/` của shadcn. Mọi tùy chỉnh màu sắc phải thông qua CSS Variables trong `globals.css` (ví dụ: map `--primary` sang màu Violet `#6D28D9`).
   * Không lạm dụng animation. Framer motion chỉ dùng cho Panel slide-in, Modal fade và Loading states có chủ đích.