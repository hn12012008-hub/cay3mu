// Comprehensive Mechanical Engineering Parts Data & Specifications
const PARTS_DATA = {
    // ---------------- ENGINE PARTS ----------------
    piston: {
        titleVi: "Piston (Quả Piston)",
        titleEn: "Piston Assembly",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Bộ phận chuyển động tịnh tiến trong lòng xilanh, tiếp nhận áp lực khí cháy sinh công và truyền lực tới thanh truyền.",
        details: [
            { label: "Vật liệu phổ biến", value: "Hợp kim nhôm đúc hoặc rèn (Al-Si: A4032, AC8A), động cơ diesel lớn dùng gang dẻo/thép đúc." },
            { label: "Nhiệt độ làm việc", value: "Đỉnh piston chịu nhiệt 300°C - 450°C; áp suất cháy lên tới 60 - 180 bar." },
            { label: "Cấu tạo chính", value: "Đỉnh piston (Crown), Vùng xéc-măng (Ring lands), Lỗ chốt (Pin bore), Váy piston (Skirt)." },
            { label: "Gia công & Xử lý", value: "Đúc áp lực / Rèn khuôn kín, phay tiện CNC chính xác, mạ váy lớp Molypden/Graphite chống xước ma sát." }
        ]
    },
    piston_rings: {
        titleVi: "Xéc-măng (Vòng găng)",
        titleEn: "Piston Rings (Compression & Oil)",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Vòng đệm kim loại đàn hồi làm kín buồng đốt, ngăn khí cháy lọt xuống các-te và gạt dầu bôi trơn thừa trên thành xilanh.",
        details: [
            { label: "Phân loại", value: "Xéc-măng lửa (Top ring), Xéc-măng khí (2nd ring), Xéc-măng dầu (Oil ring 3 chi tiết)." },
            { label: "Vật liệu", value: "Gang hợp kim xám (FC250) hoặc thép dẻo mạ Crôm cứng (Hard Chrome) / Phun phủ Nitrit gốm PVD." },
            { label: "Chức năng", value: "Bao kín buồng đốt đạt độ kín khí 99%, truyền 70% nhiệt lượng từ piston sang vách xilanh có áo nước." }
        ]
    },
    gudgeon_pin: {
        titleVi: "Chốt Piston (Chốt lách)",
        titleEn: "Gudgeon Pin (Wrist Pin)",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Trục trụ rỗng kết nối bản lề giữa piston và đầu nhỏ của thanh truyền, truyền lực đẩy tịnh tiến thành dao động lắc.",
        details: [
            { label: "Vật liệu", value: "Thép hợp kim thấm carbon (20Cr, 15CrMn, AISI 5115), bề mặt tôi cao tần HRC 58-64." },
            { label: "Chế độ lắp ghép", value: "Lắp tự do (Full-floating pin) có hai phe hãm (Circlips) hai đầu để tránh chốt cà vào thành lòng xilanh." },
            { label: "Đặc điểm cơ tính", value: "Trọng lượng nhẹ (thân rỗng), độ cứng mặt cực cao chống mài mòn, độ dai dẻo lõi chịu va đập lớn." }
        ]
    },
    connecting_rod: {
        titleVi: "Thanh truyền (Tay biên)",
        titleEn: "Connecting Rod",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Chi tiết biến đổi chuyển động tịnh tiến qua lại của piston thành chuyển động quay tròn của trục khuỷu.",
        details: [
            { label: "Cấu tạo", value: "Đầu nhỏ (Small end) nối chốt piston, Thân chữ I (Shank), Đầu to (Big end) chia làm 2 nửa bắt bu-lông." },
            { label: "Vật liệu", value: "Thép hợp kim rèn dập nóng (40Cr, 42CrMo4, AISI 4340), xe đua dùng Titan hợp kim (Ti-6Al-4V)." },
            { label: "Ứng suất làm việc", value: "Chịu lực kéo - nén uốn biến thiên chu kỳ liên tục hàng nghìn lần/phút dưới xung áp lực nổ." }
        ]
    },
    bearing: {
        titleVi: "Bạc lót thanh truyền (Bạc biên)",
        titleEn: "Connecting Rod Bearings (Bushings)",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Bạc trượt 2 nửa lót giữa đầu to thanh truyền và cổ trục khuỷu, giảm ma sát trượt nhờ màng dầu thủy động lực học.",
        details: [
            { label: "Vật liệu nhiều lớp", value: "Lưng thép nền, lớp đồng thau (Cu-Pb), bề mặt phủ hợp kim chì-thiếc (Babbitt) hoặc nhôm-thiếc (Al-Sn)." },
            { label: "Bôi trơn", value: "Dầu nhớt áp lực bơm từ bơm dầu qua lỗ khoan chéo trong trục khuỷu tạo màng nêm dầu thủy động." }
        ]
    },
    crankpin: {
        titleVi: "Cổ biên (Chốt khuỷu)",
        titleEn: "Crankpin (Rod Journal)",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Phần cổ trục đặt lệch tâm trên trục khuỷu, nơi đầu to thanh truyền lắp ghép và truyền xung áp lực sinh công.",
        details: [
            { label: "Bề mặt gia công", value: "Mài siêu tinh bóng gương (Ra < 0.1 µm), tôi cứng bề mặt bằng dòng điện cao tần." },
            { label: "Lỗ dầu bôi trơn", value: "Khoan lỗ nghiêng xuyên qua má khuỷu dẫn dầu áp lực cao từ cổ trục chính ra bôi trơn bạc biên." }
        ]
    },
    crankshaft: {
        titleVi: "Trục khuỷu (Cốt máy)",
        titleEn: "Crankshaft",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Xương sống của động cơ, tiếp nhận lực từ thanh truyền để tạo ra mô-men xoắn dẫn động bánh đà và hệ thống truyền lực.",
        details: [
            { label: "Cấu tạo", value: "Cổ trục chính (Main journal), Cổ biên (Crankpin), Má khuỷu (Web), Đối trọng (Counterweight)." },
            { label: "Vật liệu", value: "Thép hợp kim đúc hoặc rèn (42CrMo, C38) hoặc Gang cầu (FCD600/FCD700)." },
            { label: "Cân bằng động", value: "Được cân bằng tĩnh và cân bằng động bằng các khối đối trọng để triệt tiêu dao động cơ học bậc 1 và 2." }
        ]
    },
    counterweight: {
        titleVi: "Má khuỷu & Đối trọng",
        titleEn: "Crank Webs & Counterweights",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Khối lượng gia số trên trục khuỷu giúp cân bằng lực quán tính ly tâm của cổ biên và nửa đầu to thanh truyền.",
        details: [
            { label: "Mục đích", value: "Giảm rung chấn động cơ, bảo vệ bạc lót cổ trục chính không bị mài mòn lệch một phía." },
            { label: "Chế tạo", value: "Đúc liền khối hoặc đính tán/hàn then trên má trục khuỷu, khoan khử trọng lượng khi cân bằng động." }
        ]
    },
    flywheel: {
        titleVi: "Bánh đà",
        titleEn: "Flywheel",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Khối quay có mô-men quán tính lớn, tích trữ động năng ở kỳ Nổ để duy trì động cơ quay ổn định qua các kỳ cản (Hút, Nén, Xả).",
        details: [
            { label: "Vật liệu", value: "Gang xám hạt mịn (FC250) hoặc thép dập nguội cân bằng động chính xác." },
            { label: "Bộ phận phụ trợ", value: "Vành răng khởi động (Ring gear) ép nhiệt ngoài chu vi để ăn khớp với máy đề (Starter motor)." },
            { label: "Mặt tiếp xúc", value: "Mặt phẳng nhẵn bóng kết hợp làm đĩa ép cho bộ ly hợp (côn) trên xe số sàn." }
        ]
    },
    cylinder_sleeve: {
        titleVi: "Lòng Xilanh (Ống lót xilanh)",
        titleEn: "Cylinder Sleeve / Liner",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Ống trụ nhẵn bóng dẫn hướng piston chuyển động, cùng với nắp máy và piston tạo thành buồng đốt kín.",
        details: [
            { label: "Vật liệu", value: "Gang đúc xám ly tâm mác cao, phủ hợp kim chống mòn Nikasil (Niken-Silic carbide)." },
            { label: "Gia công", value: "Doa và mài bóng tinh tế tạo đường vân quả trám (Honing cross-hatch) giúp giữ lại màng dầu bôi trơn mỏng." },
            { label: "Áo nước làm mát", value: "Mặt ngoài tiếp xúc trực tiếp nước làm mát (xilanh ướt - Wet liner) hoặc ép khít thân nhôm (Dry liner)." }
        ]
    },
    crankcase: {
        titleVi: "Cácte chứa dầu",
        titleEn: "Crankcase / Oil Sump",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Phần khoang đáy bao bọc không gian quay của trục khuỷu và chứa dầu nhớt bôi trơn cho toàn bộ động cơ.",
        details: [
            { label: "Vật liệu", value: "Thép tấm dập sâu hoặc hợp kim nhôm đúc có các gân tản nhiệt làm mát dầu nhớt." },
            { label: "Bố trí", value: "Có phễu lọc dầu thô (Oil pick-up tube) và van xả dầu nhớt dưới đáy." }
        ]
    },
    cylinder_block: {
        titleVi: "Thân máy (Thân lốc máy)",
        titleEn: "Engine Block (Crankcase)",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Khung xương kết cấu lớn nhất chứa các xilanh, đường dẫn dầu bôi trơn, áo nước tản nhiệt và ổ đỡ trục khuỷu.",
        details: [
            { label: "Vật liệu", value: "Hợp kim nhôm đúc (A380) cho xe du lịch nhẹ cân, hoặc Gang xám đúc hạt mịn chịu lực." },
            { label: "Cánh tản nhiệt", value: "Động cơ làm mát bằng gió (xe máy) có các cánh tản nhiệt nhôm mỏng xếp song song để tăng diện tích tản nhiệt khí." }
        ]
    },
    cylinder_head: {
        titleVi: "Nắp Quy-lát (Nắp xilanh)",
        titleEn: "Cylinder Head",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Cụm nắp chụp đậy trên thân máy, bố trí buồng đốt, các đường ống nạp/xả, xupáp, bugi và trục cam.",
        details: [
            { label: "Vật liệu", value: "Hợp kim nhôm đúc độ bền cao (A356-T6), truyền nhiệt tốt, khối lượng nhẹ." },
            { label: "Độ kín khít", value: "Được xiết bu-lông lực cao kẹp chặt Gioăng nắp máy (Head gasket) ngăn rò rỉ khí cháy và nước làm mát." }
        ]
    },
    intake_manifold: {
        titleVi: "Cổ hút nạp khí",
        titleEn: "Intake Manifold / Runner",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Đường ống dẫn hướng luồng không khí hòa trộn nhiên liệu từ bướm ga vào buồng đốt qua cửa xupáp nạp.",
        details: [
            { label: "Khí động học", value: "Được uốn cong mượt mà tối ưu dòng chảy xoáy lốc (Swirl/Tumble) giúp hòa trộn tơi mịn xăng và gió." }
        ]
    },
    exhaust_manifold: {
        titleVi: "Cổ xả khí thải",
        titleEn: "Exhaust Manifold",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Ống gom khí xả nhiệt độ cao từ xupap xả đưa tới bộ xúc tác xử lý khí thải và ống pô giảm thanh.",
        details: [
            { label: "Vật liệu", value: "Gang xám chịu nhiệt cao chống cong vênh hoặc thép không gỉ (Inox 304) chịu nhiệt 800°C." }
        ]
    },
    rocker_cover: {
        titleVi: "Nắp giàn cò / Nắp che trục cam",
        titleEn: "Valve Cover / Camshaft Cover",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Nắp che trên cùng bảo vệ hệ thống phân phối khí (trục cam, cò mổ, lò xo xupap) và ngăn bắn dầu nhớt.",
        details: [
            { label: "Vật liệu", value: "Nhôm đúc hoặc nhựa nhiệt dẻo kỹ thuật composite gia cường sợi thủy tinh." }
        ]
    },
    intake_valve: {
        titleVi: "Xupáp nạp",
        titleEn: "Intake Valve",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Van cơ khí mở ra ở kỳ Hút để cho hỗn hợp không khí - xăng (hoặc khí nạp sạch) tràn vào lòng xilanh.",
        details: [
            { label: "Đặc điểm nhận diện", value: "Đường kính nấm xupap nạp luôn lớn hơn xupap xả khoảng 15-20% để nạp đầy hòa khí tối đa." },
            { label: "Vật liệu", value: "Thép hợp kim Chrome-Silic (SUH3, SUH11) chống mài mòn, chịu nhiệt 300°C - 500°C." },
            { label: "Điều khiển", value: "Được đóng mở chính xác bởi cam nạp và lò xo hồi vị nén đàn hồi cao." }
        ]
    },
    exhaust_valve: {
        titleVi: "Xupáp xả",
        titleEn: "Exhaust Valve",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Van cơ khí mở ra ở kỳ Xả để đẩy toàn bộ khí thải sau khi cháy ra ngoài đường ống xả.",
        details: [
            { label: "Nhiệt độ làm việc", value: "Cực kỳ khắc nghiệt: 700°C - 900°C dưới dòng luồng khí thải áp suất cao ăn mòn hóa học." },
            { label: "Vật liệu siêu chịu nhiệt", value: "Thép Austenitic siêu hợp kim (SUH35, Inconel 751), thân xupap cao cấp rỗng chứa Natri lỏng giải nhiệt." }
        ]
    },
    spark_plug: {
        titleVi: "Bugi đánh lửa",
        titleEn: "Spark Plug",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Thiết bị phóng tia lửa điện cao áp (12.000 - 30.000 Volt) đốt cháy hòa khí nén ở cuối kỳ Nén.",
        details: [
            { label: "Cấu tạo", value: "Điện cực trung tâm, Thân sứ cách điện nhôm oxit (Al2O3), Vỏ ren kim loại, Khe hở điện cực (0.7 - 1.1 mm)." },
            { label: "Công nghệ điện cực", value: "Điện cực hợp kim Iridium hoặc Platinum (Bạch kim) có độ bền 100.000 km, tia lửa gom mạnh, chống bám muội." }
        ]
    },
    combustion_chamber: {
        titleVi: "Buồng đốt",
        titleEn: "Combustion Chamber",
        mechanism: "Động cơ đốt trong 4 kỳ",
        summary: "Khoảng không gian kín giữa đỉnh piston ở điểm chết trên (TDC) và hõm nắp quy-lát, nơi diễn ra phản ứng cháy nổ nhiệt động học.",
        details: [
            { label: "4 Kỳ hoạt động", value: "1. Hút (Nạp khí) -> 2. Nén (Tăng P & T) -> 3. Nổ (Đốt cháy sinh công) -> 4. Xả (Thải khí cháy)." },
            { label: "Tỉ số nén (Compression ratio)", value: "Khoảng 9:1 đến 14:1 trên động cơ xăng, 16:1 đến 22:1 trên động cơ diesel." }
        ]
    },

    // ---------------- PLANETARY GEARBOX ----------------
    sun_gear: {
        titleVi: "Bánh răng mặt trời",
        titleEn: "Sun Gear",
        mechanism: "Hộp số bánh răng hành tinh",
        summary: "Bánh răng trung tâm nằm ở lõi hệ thống, ăn khớp ngoài trực tiếp với tất cả các bánh răng hành tinh xung quanh.",
        details: [
            { label: "Vật liệu", value: "Thép hợp kim cán nhiệt luyện (20CrMnTi, SCM420), thấm carbon bề mặt HRC 58-62." },
            { label: "Ứng dụng", value: "Nhận truyền động từ trục vào hộp số tự động hoặc mô-tơ điện trên xe Hybrid (Toyota e-CVT)." }
        ]
    },
    input_shaft: {
        titleVi: "Trục đầu vào (Trục chủ động)",
        titleEn: "Input Shaft (Sun Shaft)",
        mechanism: "Hộp số bánh răng hành tinh",
        summary: "Trục dẫn truyền công suất mô-men xoắn từ động cơ hoặc biến mô thủy lực vào bánh răng mặt trời.",
        details: [
            { label: "Vật liệu", value: "Thép hợp kim thấm tôi 20CrMnTi hoặc 40CrNiMo, then hoa cán nguội độ chính xác cao." }
        ]
    },
    output_shaft: {
        titleVi: "Trục đầu ra (Trục bị động)",
        titleEn: "Output Shaft",
        mechanism: "Hộp số bánh răng hành tinh",
        summary: "Trục liên kết với cần dẫn (hoặc vành răng) đưa công suất đã biến đổi mô-men ra các đăng và cầu xe.",
        details: [
            { label: "Vật liệu", value: "Thép cường độ cao chống biến dạng xoắn dưới mô-men giật tải lớn." }
        ]
    },
    planet_gear: {
        titleVi: "Bánh răng hành tinh",
        titleEn: "Planet Gears (Pinions)",
        mechanism: "Hộp số bánh răng hành tinh",
        summary: "Các bánh răng vệ tinh vừa tự quay quanh trục của chính mình, vừa quay tịnh tiến quanh bánh răng mặt trời.",
        details: [
            { label: "Số lượng thông dụng", value: "3 hoặc 4 bánh răng cách đều 120° hoặc 90° để chia đều tải trọng, cân bằng lực hướng tâm." },
            { label: "Răng nghiêng (Helical gear)", value: "Thường dùng răng xoắn/nghiêng để triệt tiêu tiếng ồn, tiếp xúc êm ái khi chịu mô-men xoắn cao." }
        ]
    },
    planet_carrier: {
        titleVi: "Cần dẫn (Giá mang hành tinh)",
        titleEn: "Planet Carrier",
        mechanism: "Hộp số bánh răng hành tinh",
        summary: "Khung cơ khí gắn giữ các trục của bánh răng hành tinh, đóng vai trò là một trong ba trục quay chính của bộ truyền.",
        details: [
            { label: "Vật liệu", value: "Thép rèn đúc chính xác hoặc gang dẻo có độ cứng vững xoắn cao." },
            { label: "Chức năng", value: "Khi vành răng bị khóa cứng, cần dẫn quay chậm hơn bánh trời sinh ra tỉ số truyền giảm tốc tăng lực mô-men." }
        ]
    },
    ring_gear: {
        titleVi: "Vành răng ngoài (Bánh răng bao)",
        titleEn: "Ring Gear (Annulus / Internal Gear)",
        mechanism: "Hộp số bánh răng hành tinh",
        summary: "Bánh răng có răng ở mặt trong bao bọc quanh các bánh răng hành tinh.",
        details: [
            { label: "Đặc điểm cơ khí", value: "Ăn khớp trong có hệ số trùng khớp cao hơn ăn khớp ngoài, khả năng chịu tải vượt trội trong không gian nhỏ." },
            { label: "Điều khiển số", value: "Được phanh giữ cố định hoặc nhả tự do bằng các dải đai phanh (Brake bands) hoặc ly hợp ướt nhiều đĩa." }
        ]
    },

    // ---------------- STEERING RACK & PINION ----------------
    pinion_gear: {
        titleVi: "Bánh răng quả dứa (Trục lái chủ động)",
        titleEn: "Steering Pinion Gear",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Bánh răng nhỏ gắn với trục vô lăng, biến mô-men xoay của tay lái thành lực đẩy tịnh tiến của thanh răng.",
        details: [
            { label: "Vật liệu", value: "Thép tôi hợp kim (AISI 8620, 40Cr), nhiệt luyện cao tần chống mòn ren răng." },
            { label: "Cấu hình", value: "Răng nghiêng ăn khớp êm, triệt tiêu khe hở (backlash) bằng lò xo ép tỳ dẫn hướng." }
        ]
    },
    rack_shaft: {
        titleVi: "Thanh răng thước lái",
        titleEn: "Steering Rack Bar",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Thanh thép dài có phay các rãnh răng ở giữa, trượt tịnh tiến sang trái hoặc phải để bẻ góc lái hai bánh xe.",
        details: [
            { label: "Vật liệu", value: "Thép tròn hợp kim cán nguội tôi cảm ứng (AISI 1045 / 4140)." },
            { label: "Tỉ số lái (Steering Ratio)", value: "Thường từ 12:1 đến 18:1; thanh răng bước biến thiên (Variable ratio) cho cảm giác lái nhạy khi ôm cua gắt." }
        ]
    },
    tie_rod: {
        titleVi: "Thanh giằng lái & Rô-tuyn",
        titleEn: "Tie Rods & Ball Joints",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Đòn liên kết khớp cầu truyền chuyển động đẩy kéo từ thước lái đến moay-ơ bánh xe, đồng thời triệt tiêu dao động nhún của hệ thống treo.",
        details: [
            { label: "Cấu tạo", value: "Rô-tuyn lái trong (Inner tie rod), Thanh ren chỉnh độ chụm (Toe angle), Rô-tuyn lái ngoài (Outer tie rod end)." },
            { label: "Khớp cầu (Ball joint)", value: "Chứa bi thép mạ chrome và chén nhựa bôi trơn vĩnh cửu bằng mỡ chịu nhiệt bên trong chụp cao su kín." }
        ]
    },
    steering_column: {
        titleVi: "Cột lái / Trục lái",
        titleEn: "Steering Column Shaft",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Trục dẫn truyền lực vần vô lăng của tài xế xuống bánh răng quả dứa ở thước lái.",
        details: [
            { label: "An toàn thụ động", value: "Có cơ cấu co rụt hấp thụ xung lực (Collapsible column) để bảo vệ ngực tài xế khi xảy ra va chạm trực diện." }
        ]
    },
    steering_wheel: {
        titleVi: "Vô lăng (Vành tay lái)",
        titleEn: "Steering Wheel",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Bộ phận điều khiển đầu vào của người lái, biến cánh tay đòn xoay thành mô-men xoắn lái.",
        details: [
            { label: "Cấu tạo", value: "Khung hợp kim magiê/nhôm bọc mút xốp polyurethane và da nhân tạo tạo độ bám êm ái." }
        ]
    },
    rack_teeth: {
        titleVi: "Vùng răng ăn khớp",
        titleEn: "Gear Mesh Region",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Điểm tiếp xúc ăn khớp trực tiếp giữa bánh răng quả dứa và thanh răng, biến chuyển động quay thành chuyển động tịnh tiến.",
        details: [
            { label: "Bôi trơn", value: "Bôi trơn kín vĩnh cửu bằng mỡ lithium chịu cực áp (EP Lithium Grease)." }
        ]
    },
    steering_housing: {
        titleVi: "Vỏ thước lái",
        titleEn: "Steering Rack Housing",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Vỏ ống bảo vệ thanh răng bên trong, gắn cố định vào khung gầm (subframe) của xe.",
        details: [
            { label: "Vật liệu", value: "Đúc từ hợp kim nhôm áp lực nhẹ cân hoặc ống thép hàn liền mạch." }
        ]
    },
    rubber_boot: {
        titleVi: "Chụp bụi thước lái (Ống cao su xếp)",
        titleEn: "Steering Rack Bellows / Boots",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Ống cao su hình xếp nếp ngăn nước, bùn đất và cát lọt vào làm xước thanh răng và hỏng phốt dầu.",
        details: [
            { label: "Vật liệu", value: "Cao su tổng hợp Neoprene hoặc chất đàn hồi nhiệt dẻo TPE chống dầu mỡ và lão hóa thời tiết." }
        ]
    },
    brake_disc: {
        titleVi: "Đĩa phanh thông gió",
        titleEn: "Ventilated Brake Disc",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Đĩa kim loại gắn chặt vào moay-ơ bánh xe, bị má phanh ép chặt để giảm tốc độ chuyển động.",
        details: [
            { label: "Vật liệu", value: "Gang xám (FC200/FC250) có các rãnh thông gió ở giữa để tản nhiệt nhanh do ma sát." }
        ]
    },
    road_wheel: {
        titleVi: "Cụm Bánh xe & Phanh đĩa",
        titleEn: "Wheel Hub & Disc Brake Assembly",
        mechanism: "Cơ cấu lái Bánh răng - Thanh răng",
        summary: "Bộ phận tiếp xúc trực tiếp mặt đường, đổi hướng chuyển động của phương tiện theo nguyên lý góc lái Ackerman.",
        details: [
            { label: "Góc quay lái", value: "Tối đa khoảng 30° - 38° tùy thuộc góc giới hạn của hốc bánh và khớp đồng tốc bán trục." },
            { label: "Đĩa phanh", value: "Gang xám thông gió (Ventilated cast iron disc) tản nhiệt nhanh khi phanh giảm tốc." }
        ]
    }
};

window.PARTS_DATA = PARTS_DATA;
