import React, { useState, useEffect, useCallback, useMemo } from 'react';

const styles = {
    // CSS GLOBAL & BIẾN
    global: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        
        /* Biến màu sắc */
        :root {
            --primary: #3b82f6; 
            --secondary: #10b981; 
            --poke-yellow: #fcd3d9;
            --currency-green: #34d399;
            --hcmus-blue: #1e40af;
            --bg-body-light: #f9fafb;
            --text-body-light: #374151;
            --bg-card-light: #ffffff;
            --text-link-light: #4b5563;
        }

        /* Base styles */
        body {
            margin: 0; padding: 0; font-family: 'Inter', sans-serif; 
            background-color: var(--bg-body-light); color: var(--text-body-light);
            transition: background-color 0.3s, color 0.3s;
            scroll-behavior: smooth;
        }

        /* Dark Mode */
        html.dark {
            --bg-body-dark: #1a1a2e;
            --text-body-dark: #e4e4f0;
            --bg-card-dark: #2c2c54;
            --bg-navbar-dark: #16162d;
            --bg-footer-dark: #16162d;

            background-color: var(--bg-body-dark);
        }
        .dark body { background-color: var(--bg-body-dark); color: var(--text-body-dark); }
        .dark .card { background-color: var(--bg-card-dark); }
        .dark .navbar { background-color: var(--bg-navbar-dark); }
        .dark .footer { background-color: var(--bg-footer-dark); }
        .dark .text-gray-400 { color: #9ca3af; }
        .dark .text-gray-300 { color: #d1d5db; }
        .dark .text-gray-500 { color: #6b7280; }
        .dark .hover\\:bg-blue-50:hover { background-color: transparent; }
        .dark .dark\\:hover\\:bg-gray-700:hover { background-color: #374151; }


        /* Utility Classes */
        .main-content { max-width: 1280px; margin: 0 auto; padding: 3rem 1rem; }
        .card { 
            background-color: var(--bg-card-light); padding: 2rem; border-radius: 0.75rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background-color 0.3s, box-shadow 0.3s;
        }
        .cv-item { border-left: 3px solid var(--secondary); padding-left: 1rem; }

        /* Animations */
        @keyframes bounce-y { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-y { animation: bounce-y 1.5s infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .loading-spin { animation: spin 1s linear infinite; }
        @media (min-width: 768px) {
    /* CSS cho Menu Desktop (Navbar) */
    .nav-desktop {
        display: flex; /* Bật Flexbox để căn chỉnh và tạo khoảng cách */
        gap: 2rem; /* Tạo khoảng cách giữa các mục (tương đương space-x-8) */
    }
}
        .contact-form label {
    display: block;
    margin-bottom: 4px; 
    font-size: 0.875rem; 
    font-weight: 500;
}

/* Input và Textarea chiếm 100% chiều rộng */
.contact-form input[type="text"],
.contact-form input[type="email"],
.contact-form textarea {
    width: 100%; 
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid #4b5563; 
    box-sizing: border-box;
    background-color: #374151;
    color: white;
}

/* Căn chỉnh khoảng cách giữa các nhóm trường */
.contact-form .form-group {
    margin-bottom: 1rem;
}
    `,
};
// --- 1. useTheme ---
const useTheme = () => {
    const [isDark, setIsDark] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme === 'light' ? false : true; 
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

    return { isDark, toggleTheme };
};

// --- 2. usePikachu ---
const usePikachu = () => {
    const [data, setData] = useState(null);
    const [isShiny, setIsShiny] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPikachu = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const apiUrl = 'https://pokeapi.co/api/v2/pokemon/pikachu';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Không thể tải dữ liệu Pikachu.');
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleShiny = useCallback(() => setIsShiny(prev => !prev), []);

    useEffect(() => {
        fetchPikachu();
    }, [fetchPikachu]);

    return { data, isShiny, isLoading, error, toggleShiny, fetchPikachu };
};

// --- 3. useExchangeRate ---
const useExchangeRate = () => {
    const [rate, setRate] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Lỗi mạng hoặc API không phản hồi.');
            const data = await response.json();
            if (!data.rates || !data.rates.VND) throw new Error('Không tìm thấy tỷ giá VND.');
            
            setRate(data.rates.VND);
        } catch (err) {
            setError(err.message);
            setRate(0);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRate();
    }, [fetchRate]);
    
    const convertCurrency = (amount, isUsdToVnd) => {
        if (isNaN(amount) || amount <= 0 || rate === 0) return '';
        if (isUsdToVnd) {
            return (amount * rate).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return (amount / rate).toFixed(2);
        }
    };

    return { rate, isLoading, error, fetchRate, convertCurrency };
};

// --- 4. useWeather ---
const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState('Đang tìm vị trí...');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const defaultLat = 10.8231; // TP.HCM
    const defaultLon = 106.6297;

    const getWeatherIcon = (code) => {
        const icons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️', 51: '🌧️', 53: '🌧️', 55: '🌧️', 61: '🌦️', 63: '🌧️', 65: '⛈️', 71: '🌨️', 73: '🌨️', 75: '🌨️', 80: '☔', 81: '☔', 82: '⛈️', 95: '🌩️', 96: '⛈️', 99: '⛈️', };
        return icons[code] || '❓';
    };

    const getWeatherDescription = (code) => {
        const descriptions = {
            0: 'Trời Quang Mây', 1: 'Chủ yếu quang mây', 2: 'Mây rải rác', 3: 'Trời Âm U',
            45: 'Có Sương Mù', 48: 'Sương mù đóng băng', 51: 'Mưa phùn nhẹ', 53: 'Mưa phùn vừa',
            55: 'Mưa phùn đậm', 61: 'Mưa nhẹ', 63: 'Mưa vừa', 65: 'Mưa to', 71: 'Tuyết rơi nhẹ',
            73: 'Tuyết rơi vừa', 75: 'Tuyết rơi dày', 80: 'Mưa rào nhẹ', 81: 'Mưa rào vừa',
            82: 'Mưa rào lớn', 95: 'Giông bão', 96: 'Giông bão kèm mưa đá nhỏ', 99: 'Giông bão kèm mưa đá lớn',
        };
        return descriptions[code] || 'Không xác định';
    };

    const loadWeather = useCallback(async (lat, lon) => {
        setIsLoading(true);
        setError(null);
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Không thể tải dữ liệu thời tiết.');
            const data = await response.json();
            const current = data.current_weather;

            setWeather({
                temp: current.temperature,
                windSpeed: current.windspeed,
                code: current.weathercode,
                icon: getWeatherIcon(current.weathercode),
                description: getWeatherDescription(current.weathercode),
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchWeatherByLocation = useCallback(() => {
        setIsLoading(true);
        const success = (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLocation(`Vị trí hiện tại: (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
            loadWeather(lat, lon);
        };
        const error = (err) => {
            setLocation(`Mô phỏng tại: TP. Hồ Chí Minh (Vị trí bị từ chối/Không hỗ trợ)`);
            loadWeather(defaultLat, defaultLon);
            console.warn(`LỖI GEOLOCATION (${err.code}): ${err.message}`);
        };
        const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

        if (navigator.geolocation) {
            setLocation('Đang tìm vị trí hiện tại...');
            navigator.geolocation.getCurrentPosition(success, error, options);
        } else {
            error({code: 0, message: "Trình duyệt không hỗ trợ Geolocation."});
        }
    }, [loadWeather, defaultLat, defaultLon]);

    useEffect(() => {
        fetchWeatherByLocation();
    }, [fetchWeatherByLocation]);

    return { weather, location, isLoading, error, fetchWeatherByLocation };
};

// --- 1. Navbar Component ---
const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = useMemo(() => ([
        { href: "#gioi-thieu", label: "Giới Thiệu" },
        { href: "#ho-so", label: "Hồ Sơ (CV)" },
        { href: "#du-an-api", label: "Dự Án API", highlight: true },
        { href: "#du-an", label: "Dự Án Khác" },
        { href: "#lien-he", label: "Liên Hệ" },
    ]), []);
    
    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            setIsMenuOpen(false); 
        }
    };

    return (
        <header id="navbar" className={`navbar sticky top-0 z-50 shadow-md transition-colors duration-300`}>
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center`}>
                <a href="#hero" className={`text-2xl font-extrabold text-primary`}>Nguyễn Chí Trọng</a>

                {/* Menu Desktop */}
                <nav className="nav-desktop hidden md:flex space-x-8">
                    {navItems.map(item => (
                        <a key={item.href} href={item.href} className={`text-gray-400 hover:text-primary transition duration-150 font-medium ${item.highlight ? 'font-bold text-secondary' : ''}`} onClick={handleNavClick}>
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Nút chuyển đổi Sáng/Tối và Menu Mobile */}
                <div className="flex items-center space-x-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700 transition duration-150 cursor-pointer"
        style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: 'transparent', /* Đảm bảo không có nền trắng */
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
                        {isDark ? (
                            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        ) : (
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 01-8 0 4 4 0 018 0z"></path></svg>
                        )}
                    </button>
                    
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition duration-150 cursor-pointer"
        style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: 'transparent', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
                        <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>

            {/* Menu Mobile Dropdown */}
            {isMenuOpen && (
                <nav className="md:hidden bg-gray-800 shadow-lg px-2 pt-2 pb-3 space-y-1">
                    {navItems.map(item => (
                        <a key={item.href} href={item.href} onClick={handleNavClick} className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 ${item.highlight ? 'text-secondary' : ''}`}>
                            {item.label}
                        </a>
                    ))}
                </nav>
            )}
        </header>
    );
};

// --- 2. Hero Component ---
const Hero = () => {
    return (
        <section id="hero" className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 pb-24 min-h-screen">
            <div className="md:w-1/2">
                <p className="text-xl text-secondary font-semibold mb-3 animate-pulse">Xin chào, tôi là</p>
                <h1 className="text-6xl sm:text-7xl font-extrabold leading-tight mb-4 text-primary">NGUYỄN CHÍ TRỌNG</h1>
                <h2 className="text-3xl sm:text-4xl font-light text-gray-300 mb-6">
                    Sinh viên <span style={{fontWeight: 'normal'}}>Đại học Khoa học Tự nhiên</span>
                    <span style={{color: 'var(--primary)', margin: '0 0.5rem'}}>|</span>
                    Khoa Công nghệ Vật Lý Điện tử và Tin học
                </h2>
                <p className="text-lg text-gray-400 mb-2 max-w-lg"><span className="font-medium text-primary">Email:</span> nguyenchitrong04@gmail.com</p>
                <p className="text-lg text-gray-400 mb-8 max-w-lg"><span className="font-medium text-primary">Địa chỉ:</span> 73 Nguyễn Huệ, Phan Thiết, Bình Thuận</p>
                <div className="flex space-x-4">
                    <a href="#ho-so" className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Xem Hồ Sơ (CV)</a>
                    <a href="#lien-he" className="px-6 py-3 border border-primary text-primary font-semibold rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-300">Liên Hệ</a>
                </div>
            </div>

            <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
                <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                    <div className="absolute inset-0 border-4 border-primary rounded-full transform rotate-45 animate-spin-slow opacity-10"></div>
                    <img className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white dark:border-gray-800 transition duration-300" 
                         src="https://i.postimg.cc/jSWLg5FT/Screenshot-103.png" 
                         alt="Ảnh đại diện Nguyễn Chí Trọng" />
                </div>
            </div>
        </section>
    );
};

// --- 3. About Component ---
const About = () => (
    <section id="gioi-thieu" className="py-20">
        <h2 className={`text-4xl font-bold text-center mb-12 border-b-4 border-secondary inline-block pb-2`}>Giới Thiệu Chung</h2>
        <div className="card max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-primary mb-4">Mục Tiêu Cá Nhân</h3>
            <p className="text-lg mb-6 leading-relaxed cv-item">
                Hướng đến việc phát triển bản thân thông qua làm việc trong môi trường chuyên nghiệp để học hỏi, tích lũy thêm kinh nghiệm và phát triển kỹ năng.
            </p>
            <h3 className="text-2xl font-semibold text-primary mt-8 mb-4">Sở Thích</h3>
            <div className="cv-item" 
                style={{
                    display: 'flex', 
                    gap: '1rem', 
                    flexWrap: 'wrap' 
                }}>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium">Nghe nhạc</span>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium">Visual novel</span>
            </div>
        </div>
    </section>
);

// --- 4. CVSection Component ---
const CVSection = () => (
    <section id="ho-so" className="py-20 bg-gray-100 dark:bg-gray-900 rounded-xl">
        <h2 className={`text-4xl font-bold text-center mb-12 border-b-4 border-primary inline-block pb-2`}>Hồ Sơ Chi Tiết (CV)</h2>
        <div className="card max-w-4xl mx-auto">
            {/* 1. TRÌNH ĐỘ HỌC VẤN */}
            <div className="mb-10">
                <h3 className="text-3xl font-bold text-primary mb-4 border-b pb-2">TRÌNH ĐỘ HỌC VẤN</h3>
                <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg shadow-xl overflow-hidden" style={{backgroundColor: 'var(--hcmus-blue)'}}>
                        <img src="https://placehold.co/100x100/1e40af/ffffff?text=HCMUS" alt="Logo HCMUS Placeholder" className="w-full h-full object-cover p-2" />
                    </div>
                    <div className="cv-item flex-grow">
                        <p className="text-xl font-semibold">Đại học Khoa học Tự nhiên, ĐHQG-HCM</p>
                        <p className="text-lg text-gray-400">Sinh viên năm 4</p>
                        <p className="text-md text-gray-500 dark:text-gray-500">Chuyên ngành: Công nghệ Vật Lý Điện tử và Tin học</p>
                        <p className="text-md text-gray-500 dark:text-gray-500">Dự kiến tốt nghiệp: Tháng 10/2026</p>
                        <p className="text-md font-medium mt-1">Điểm TB: 7.14</p>
                    </div>
                </div>
            </div>
            
            {/* 2. KỸ NĂNG */}
            <div className="mb-10">
                <h3 className="text-3xl font-bold text-primary mb-4 border-b pb-2">KỸ NĂNG</h3>
                <ul className="list-disc list-inside space-y-2 pl-4 text-lg">
                    <li className="cv-item">Khả năng làm việc nhóm tốt</li>
                    <li className="cv-item">Kỹ năng phân tích, quản lý thời gian hiệu quả</li>
                    <li className="cv-item">Sử dụng tốt các công cụ văn phòng: Word, Excel</li>
                    <li className="cv-item">Ngôn ngữ lập trình và công cụ: <span className="font-medium text-secondary">C++, Python, Proteus</span></li>
                </ul>
            </div>
            
            {/* 3. ĐỒ ÁN THAM GIA */}
            <div className="mb-10">
                <h3 className="text-3xl font-bold text-primary mb-4 border-b pb-2">ĐỒ ÁN THAM GIA</h3>
                <ul className="list-disc list-inside space-y-4 pl-4 text-lg">
                    <li className="cv-item">Python: Population.</li>
                    <li className="cv-item">Xử lý tín hiệu lọc nhiễu âm thanh.</li>
                    <li className="cv-item">Dự đoán bệnh sử dụng máy học.</li>
                    <li className="cv-item">Lắp ráp mô hình chuyển động bằng radar.</li>
                    <li className="cv-item">Ứng dụng mạch đếm số vào bộ đếm vật thể và xử lý tín hiệu đèn giao thông cho người qua đường.</li>
                </ul>
            </div>
            
            {/* 4. HOẠT ĐỘNG KHÁC */}
            <div>
                <h3 className="text-3xl font-bold text-primary mb-4 border-b pb-2">HOẠT ĐỘNG & GIẢI THƯỞNG</h3>
                <div className="text-lg text-gray-400 cv-item">
                    <p className="font-medium text-lg">Hoạt động Tình Nguyện và Ngoại Khóa</p>
                    <p className="font-medium text-lg mt-2">Giải Thưởng</p>
                </div>
            </div>
        </div>
    </section>
);

// --- 5. Project API Components ---
const PikachuCard = () => {
    const { data, isShiny, isLoading, error, toggleShiny } = usePikachu();

    if (isLoading) return (
        <div className="card p-6 border-2 border-poke-yellow/50 text-center" style={{backgroundColor: '#8b5e671a'}}>
            <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--poke-yellow)'}}>POKEAPI: PIKACHU</h3>
            <div className="flex justify-center items-center h-48">
                <svg className="loading-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="text-gray-400 ml-3">Đang tải dữ liệu...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="card p-6 border-2 border-poke-yellow/50 text-center" style={{backgroundColor: '#8b5e671a'}}>
            <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--poke-yellow)'}}>POKEAPI: PIKACHU</h3>
            <p className="text-red-400 mt-4">Lỗi: {error}</p>
        </div>
    );
    
    const pikachuImage = isShiny ? data.sprites.front_shiny : data.sprites.front_default;
    const pikachuAbilities = data.abilities.map(a => a.ability.name).join(', ');
    const pikachuWeight = data.weight / 10;
    const statusText = isShiny ? 'Shiny' : 'Normal';
    const typeName = data.types[0].type.name.toUpperCase();

    return (
        <div className="card p-6 border-2 border-poke-yellow/50 text-center transition duration-300" style={{backgroundColor: '#8b5e671a'}}>
            <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--poke-yellow)'}}>POKEAPI: PIKACHU</h3>
            <div id="pikachu-data">
                <img src={pikachuImage} alt={`Pikachu ${statusText}`} className="mx-auto w-32 h-32 object-contain animate-bounce-y" />
                <p className="text-3xl font-extrabold mt-4" style={{color: 'var(--poke-yellow)'}}>#{data.id} {data.name.toUpperCase()} ({statusText})</p>
                <p className="text-lg text-gray-300 mt-2">Cân nặng: {pikachuWeight} kg</p>
                <p className="text-md text-gray-400 mt-1">Khả năng: {pikachuAbilities}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">Type: {typeName}</span>
                </div>
            </div>
            <button onClick={toggleShiny} className="mt-4 px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 w-full">
                Xem {isShiny ? 'Normal' : 'Shiny'}
            </button>
            <p className="text-sm text-gray-500 mt-4">Nguồn: https://pokeapi.co/api/v2/pokemon/pikachu</p>
        </div>
    );
};

const ExchangeRateCard = () => {
    const { rate, isLoading, error, fetchRate, convertCurrency } = useExchangeRate();
    const [usdAmount, setUsdAmount] = useState('1');
    const [vndAmount, setVndAmount] = useState('');

    useEffect(() => {
        setVndAmount(convertCurrency(parseFloat(usdAmount), true));
    }, [rate]);

    const handleUsdChange = (e) => {
        let value = e.target.value.replace(/[^\d.]/g, '');
        setUsdAmount(value);
        if (value) {
            setVndAmount(convertCurrency(parseFloat(value), true));
        } else {
            setVndAmount('');
        }
    };

    const handleVndChange = (e) => {
        let rawVndValue = e.target.value.replace(/,/g, '');
        rawVndValue = rawVndValue.replace(/[^\d]/g, '');
        
        if (rawVndValue) {
            const calculatedUsd = convertCurrency(parseFloat(rawVndValue), false);
            setUsdAmount(calculatedUsd);
            setVndAmount(rawVndValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        } else {
            setUsdAmount('');
            setVndAmount('');
        }
    };
    
    const formattedRate = rate.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    const rateDisplay = isLoading 
        ? 'Đang tải tỷ giá...' 
        : error 
            ? `Lỗi: ${error}` 
            : `1 USD = ${formattedRate} VND`;

    return (
        <div className="card p-6 border-2 border-currency-green/50 text-center transition duration-300" style={{backgroundColor: '#163a241a'}}>
            <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--currency-green)'}}>CHUYỂN ĐỔI TỶ GIÁ</h3>
            <div id="exchange-rate-data" className="flex flex-col gap-4">
                <div id="current-rate-display" className="p-2 rounded-lg text-sm font-medium" style={{backgroundColor: '#14532d', color: 'var(--currency-green)'}}>
                    {rateDisplay}
                </div>

                {/* Input USD */}
                <div className="flex flex-col items-start w-full">
                    <label htmlFor="usd-input" className="text-sm font-medium mb-1 text-gray-300">Nhập USD:</label>
                    <div className="relative w-full">
                        <input type="text" id="usd-input" value={usdAmount} onChange={handleUsdChange}
                               className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-currency-green focus:border-currency-green bg-gray-700 text-white text-lg pr-12"
                               placeholder="Số tiền USD"/>
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-bold" style={{color: 'var(--currency-green)'}}>USD</span>
                    </div>
                </div>

                <div className="text-2xl text-primary font-bold">&harr;</div>

                {/* Input VND */}
                <div className="flex flex-col items-start w-full">
                    <label htmlFor="vnd-input" className="block text-sm font-medium mb-1 text-gray-300">Kết quả VND:</label>
                    <div className="relative w-full">
                        <input type="text" id="vnd-input" value={vndAmount} onChange={handleVndChange}
                               className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-currency-green focus:border-currency-green bg-gray-700 text-white text-lg pr-12"
                               placeholder="Số tiền VND" readOnly={!rate}/>
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-bold" style={{color: 'var(--currency-green)'}}>VND</span>
                    </div>
                </div>
            </div>
            
            <button onClick={fetchRate} className="mt-6 px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 w-full" disabled={isLoading}>
                {isLoading ? 'Đang tải...' : 'Làm mới tỷ giá'}
            </button>
            <p className="text-sm text-gray-500 mt-2">Nguồn: Exchangerate-API</p>
        </div>
    );
};

const WeatherCard = () => {
    const { weather, location, isLoading, error, fetchWeatherByLocation } = useWeather();

    return (
        <div className="card p-6 border-2 border-blue-500/50 text-center transition duration-300" style={{backgroundColor: '#1e3a8a1a'}}>
            <h3 className="text-2xl font-bold mb-4 text-blue-400">OPEN-METEO: THỜI TIẾT</h3>
            <p id="weather-location" className="text-sm text-blue-300 mb-4">{location}</p>
            <div id="weather-data" className="min-h-48 flex flex-col justify-center items-center">
                {isLoading ? (
                    <>
                        <svg className="loading-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="text-gray-400 ml-3 mt-2">Đang tải dữ liệu...</p>
                    </>
                ) : error ? (
                    <p className="text-red-400">Lỗi: {error}</p>
                ) : weather ? (
                    <>
                        <div className="text-6xl my-4">{weather.icon}</div>
                        <p className="text-5xl font-extrabold text-blue-400">{weather.temp}°C</p>
                        <p className="text-xl text-gray-300 mt-2">{weather.description}</p>
                        <p className="text-md text-gray-400 mt-1">Tốc độ gió: {weather.windSpeed} km/h</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{backgroundColor: '#2563eb', color: '#93c5fd'}}>WMO Code: {weather.code}</span>
                        </div>
                    </>
                ) : null}
            </div>
            <button onClick={fetchWeatherByLocation} className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-full" disabled={isLoading}>
                Làm mới
            </button>
            <p className="text-sm text-gray-500 mt-2">Nguồn: api.open-meteo.com</p>
        </div>
    );
};

const APIProjects = () => (
    <section id="du-an-api" className="py-20">
        <h2 className={`text-4xl font-bold text-center mb-12 border-b-4 border-primary inline-block pb-2`}>Dự Án Tích Hợp API</h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <PikachuCard />
            <ExchangeRateCard />
            <WeatherCard />
        </div>
    </section>
);

// --- 6. OtherProjects Component ---
const OtherProjects = () => (
    <section id="du-an" className="py-20">
        <h2 className={`text-4xl font-bold text-center mb-12 border-b-4 border-secondary inline-block pb-2`}>Dự Án Khác (Từ CV)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Dự án 1 */}
            <div className="card p-6 hover:shadow-xl transition duration-300">
                <h3 className="text-2xl font-bold text-primary mb-2">1. Python: Population</h3>
                <p className="text-gray-400 mb-4">Dự án sử dụng ngôn ngữ Python. (Cần bổ sung mô tả chi tiết nếu có).</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Python</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Phân tích dữ liệu?</span>
                </div>
                <a href="#ho-so" className="text-secondary hover:text-green-600 font-medium">Xem chi tiết trong CV &rarr;</a>
            </div>
            {/* Dự án 2 */}
            <div className="card p-6 hover:shadow-xl transition duration-300">
                <h3 className="text-2xl font-bold text-primary mb-2">2. Xử lý tín hiệu lọc nhiễu âm thanh</h3>
                <p className="text-gray-400 mb-4">Đồ án liên quan đến xử lý tín hiệu số để loại bỏ nhiễu từ âm thanh.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Xử lý tín hiệu</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Điện tử</span>
                </div>
                <a href="#ho-so" className="text-secondary hover:text-green-600 font-medium">Xem chi tiết trong CV &rarr;</a>
            </div>
            {/* Dự án 3 */}
            <div className="card p-6 hover:shadow-xl transition duration-300">
                <h3 className="text-2xl font-bold text-primary mb-2">3. Dự đoán bệnh sử dụng máy học</h3>
                <p className="text-gray-400 mb-4">Ứng dụng các thuật toán Machine Learning vào lĩnh vực y tế.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Máy học (ML)</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">Python</span>
                </div>
                <a href="#ho-so" className="text-secondary hover:text-green-600 font-medium">Xem chi tiết trong CV &rarr;</a>
            </div>
        </div>
    </section>
);

// --- 7. Contact Component ---
const Contact = () => {
    const [formMessage, setFormMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        setFormMessage('Đang gửi...');
        setMessageType('');
        
        setTimeout(() => {
            setFormMessage(`Cảm ơn ${name}! Tin nhắn của bạn đã được gửi thành công. Tôi sẽ phản hồi sớm nhất có thể.`);
            setMessageType('success');
            e.target.reset();
        }, 1500);
    };

    return (
    <section id="lien-he" className="py-20">
        <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-secondary inline-block pb-2">Liên Hệ</h2>

        <div className="max-w-xl mx-auto card p-8 rounded-xl shadow-lg transition-colors duration-300">
            <p className="text-lg text-center text-gray-400 mb-6">
                Hãy liên hệ với tôi qua email hoặc điện thoại để thảo luận về cơ hội làm việc hoặc hợp tác!
            </p>
            
            {/* THÊM CLASS CSS MỚI CHO FORM */}
            <form onSubmit={handleSubmit} className="contact-form" id="contact-form">
                
                {/* TRƯỜNG 1: Tên của bạn */}
                <div className="form-group">
                    <label htmlFor="name">Tên của bạn</label>
                    <input type="text" id="name" name="name" required
                           className="focus:ring-primary focus:border-primary bg-gray-700 text-white"/>
                </div>
                
                {/* TRƯỜNG 2: Email */}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required
                           className="focus:ring-primary focus:border-primary bg-gray-700 text-white"/>
                </div>
                
                {/* TRƯỜNG 3: Nội dung (Dùng style inline để ghi đè margin-bottom) */}
                <div className="form-group" style={{marginBottom: '1.5rem'}}>
                    <label htmlFor="message">Nội dung</label>
                    <textarea id="message" name="message" rows="4" required
                              className="focus:ring-primary focus:border-primary bg-gray-700 text-white"></textarea>
                </div>
                
                {/* NÚT GỬI */}
                <button type="submit" 
                        className="w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                    Gửi Tin Nhắn
                </button>
                
                {/* HIỂN THỊ THÔNG BÁO */}
                {formMessage && (
                    <p className={`text-center mt-4 font-medium ${messageType === 'success' ? 'text-green-500' : 'text-gray-500'}`}>
                        {formMessage}
                    </p>
                )}
            </form>

        </div>
    </section>
);
};

// --- 8. Footer Component ---
const Footer = () => (
    <footer className="footer shadow-inner mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">
            <p>&copy; 2024 Nguyễn Chí Trọng. Mọi quyền được bảo lưu.</p>
            <p className="mt-2 text-sm">Thiết kế với ❤️ và React (từ Tailwind gốc).</p>
        </div>
    </footer>
);

const App = () => {
    return (
        <div className="app-container">
            {/* Nhúng CSS Global */}
            <style>{styles.global}</style>
            
            <Navbar />
            <main className="main-content">
                <Hero />
                <About />
                <CVSection />
                <APIProjects />
                <OtherProjects />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default App;
