# CƠ KHÍ 3D · MECHLAB
### Khám Phá Cấu Tạo & Động Học Máy Móc Cơ Khí Tương Tác 3D

Một ứng dụng web mô phỏng 3D thời gian thực chuyên sâu về cơ khí chế tạo máy, động lực học và kỹ thuật ô tô. Xây dựng hoàn toàn bằng **Three.js** và WebGL hiện đại với đồ họa kim loại PBR (Physically Based Rendering) sắc nét.

---

## 🚀 Cách Mở Ứng Dụng
1. **Cách 1 (Nhanh nhất):** Nhấp đúp vào tệp [`start.bat`](start.bat) trong thư mục này.
2. **Cách 2:** Mở trực tiếp tệp [`index.html`](index.html) bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Brave,...).

---

## 🛠️ 3 Cơ Cấu Cơ Khí Nổi Bật Được Tích Hợp

### 1. Động Cơ Đốt Trong 4 Kỳ (4-Stroke IC Engine)
* **Chu trình 4 kỳ nhiệt động học:**
  1. *Kỳ Hút (Intake):* Xupáp nạp mở, hòa khí tràn vào lòng xilanh (hiển thị màu xanh khí tươi).
  2. *Kỳ Nén (Compression):* Cả 2 xupáp đóng kín, piston nén hòa khí lên áp suất cao (hiển thị màu hổ phách).
  3. *Kỳ Nổ / Sinh công (Power):* Bugi phóng tia lửa điện rực sáng (có âm thanh đánh lửa), khí cháy bùng nổ đẩy piston xuống (hiển thị màu lửa đỏ).
  4. *Kỳ Xả (Exhaust):* Xupáp xả mở, piston đẩy khí thải ra ngoài (hiển thị màu khói xám).
* **Chi tiết cơ khí mô phỏng:** Piston, rãnh xéc-măng, chốt piston, thanh truyền chữ I, bạc lót, trục khuỷu cốt máy, má khuỷu đối trọng, bánh đà, xupáp nạp/xả, lò xo, bugi, lòng xilanh và cácte.

### 2. Hộp Số Bánh Răng Hành Tinh (Planetary Gearbox)
* **Nguyên lý bánh răng vi sai & hộp số tự động:**
  * Bánh răng mặt trời (Sun gear) ở trung tâm.
  * 3 Bánh răng hành tinh (Planet gears) xoay quanh cần dẫn (Planet carrier).
  * Vành răng bao ngoài (Ring gear / Annulus).
* **3 Chế độ truyền động tương tác:**
  1. *Khóa Vành răng:* Giảm tốc & Tăng mô-men xoắn (Tỉ số truyền 3.33 : 1 - Số tiến 1 của xe).
  2. *Khóa Cần dẫn:* Đảo chiều quay (Tỉ số -2.33 : 1 - Số lùi Reverse).
  3. *Khóa Bánh trời:* Tăng tốc Overdrive (Tỉ số 0.70 : 1 - Tiết kiệm nhiên liệu đường trường).

### 3. Thước Lái Bánh Răng - Thanh Răng (Rack & Pinion Steering)
* **Cơ cấu lái ô tô hiện đại:**
  * Bánh răng quả dứa (Pinion) nối liền trục vô lăng.
  * Thanh răng dẫn động (Rack) chuyển động tịnh tiến sang trái/phải.
  * Thanh giằng lái (Tie rods) & Rô-tuyn khớp cầu (Ball joints).
  * Cụm ngõng quay, đĩa phanh thông gió và bánh xe bẻ lái góc Ackerman.

---

## 🎮 Tính Năng Tương Tác Cao Cấp

| Tính năng | Mô tả |
| :--- | :--- |
| **Bóc tách chi tiết (Exploded View)** | Kéo thanh trượt từ 0% đến 100% để các bộ phận tự động bung rời theo các trục không gian, nhìn rõ từng linh kiện bên trong |
| **Tra cứu cấu tạo (Part Inspector)** | Nhấp chuột vào bất kỳ chi tiết nào trên mô hình 3D để mở bảng thông số kỹ thuật (Tên Anh - Việt, vật liệu tiêu chuẩn JIS/AISI, điều kiện chịu tải ma sát, phương pháp gia công chế tạo) |
| **Điều chỉnh vòng tua (RPM Slider)** | Tùy chỉnh tốc độ từ 60 RPM (quay chậm quan sát) đến 3000 RPM |
| **Tua góc quay (Crank Angle Scrub)** | Khi tạm dừng, có thể kéo góc quay trục khuỷu từ 0° đến 720° từng độ một |
| **Chế độ hiển thị CAD** | Chuyển đổi linh hoạt giữa: Kim loại PBR bóng bẩy, Khung dây kỹ thuật Wireframe, và Trong suốt nhìn thấu X-Ray |
| **Âm thanh tổng hợp (Audio Synthesizer)** | Mô phỏng tiếng gầm máy nổ và tiếng ăn khớp bánh răng cơ khí theo thời gian thực dựa trên Web Audio API |
| **Góc máy định sẵn** | Chuyển nhanh giữa: Toàn cảnh 3D Isometric, Trực diện Front, Cạnh bên Side, Cận cảnh buồng đốt Combustion |
