$(document).ready(function() {
    // 새로고침 시 맨 위로 이동
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // 헤드변경 함수 지정
    const logo = $("#logo");
    const nav = $("#nav");
    const hambg = $("#hamburger div");

    let scrollChange1 = 500;
    let scrollChange2 = 1600;

    function headChange() {
        const scrollY = window.scrollY;
        let logoSrc, navColor, hambgColor;

        if (scrollY > scrollChange1) {
            logoSrc = "./images/seung_logo2.png";
            navColor = "#f0f0f0";
            hambgColor = "#f0f0f0" ;
            if (scrollY > scrollChange2){
                logoSrc = "./images/seung_logo1.png";
                navColor = "#2d3e2c";
                hambgColor = "#2d3e2c";
                }
        } else {
            logoSrc = "./images/seung_logo1.png";
            navColor = "#2d3e2c";
            hambgColor = "#2d3e2c";
        }

        logo.attr("src", logoSrc);
        nav.css({"color" : navColor});
        hambg.css({"background-color" : hambgColor});
    }

    // 모바일메뉴
    function toggleMenu() {
        $("#mob_nav").toggleClass("active");
        $("#hamburger").toggleClass("open");
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    
    function responsiveScript() {
        // 미디어쿼리 조건 설정
        const mobile = window.matchMedia("(max-width: 480px)");
        const tablet = window.matchMedia("(min-width: 481px) and (max-width: 768px)");
        const laptop = window.matchMedia("(min-width:769px) and (max-width: 1024px)")

        // 모바일용 스크립트
        if (mobile.matches) {
            console.log("모바일 스크립트 실행");
            // 모바일 전용 JS 코드
            ScrollTrigger.killAll();
            gsap.killTweensOf("*");

            scrollChange1 = 500;
            scrollChange2 = 1750;

            $("#mob_nav").removeClass("active");
            $("#hamburger").removeClass("open");

            $("#hamburger").off("click").on("click", toggleMenu);

            return;
        }

        // 태블릿용 스크립트
        if (tablet.matches) {
            console.log("태블릿 스크립트 실행");
                        
            ScrollTrigger.killAll();
            gsap.killTweensOf("*");
            // 태블릿 전용 JS 코드
            scrollChange1 = 500;
            scrollChange2 = 1600;

            return;
        }
        // 노트북, 데스크탑용 스크립트
        else {
            console.log("노트북, 데스크탑 기본 스크립트 실행");

            let currentPage = 0;
            let section = gsap.utils.toArray("section");
            let portBox = gsap.utils.toArray(".port_box");

            const totalPages = section.length + portBox.length - 1;
            let isThrottled = false; // 빠른 연속 스크롤 시 중복

            function scrollPage(direction) {
                if (isThrottled) return;
                isThrottled = true;

                if (direction === "down" && currentPage < totalPages - 1) {
                    currentPage++;
                } else if (direction === "up" && currentPage > 0) {
                    currentPage--;
                }

                gsap.to(window, {
                    scrollTo: {y: window.innerHeight * currentPage, autoKill: false},
                    duration: 1,
                    ease: "power2.inOut"
                });

                setTimeout(() => {isThrottled = false}, 800);
            }

            // 가로 스크롤
            gsap.to (portBox, {
                xPercent: -100 * (portBox.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: "#hor",
                    start: "top top",
                    end: () => document.querySelector("#footer").offsetTop,
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    snap: {
                        snapTo: 1/ (portBox.length - 1),
                        duration: 0.5,
                        ease: "power1.inOut",
                    },
                    onLeave: () => ScrollTrigger.getById("hor")?.kill()
                }
            });

            ScrollTrigger.refresh();


            window.addEventListener("wheel", function(event) {
                scrollPage(event.deltaY > 0 ? "down" : "up");
            },{passive: false});

        }

        headChange();
    }


    // 스크롤 이벤트에 throttle 적용
    let scrollTimeout;
    window.addEventListener("scroll", function () {
        if(!scrollTimeout) {
            requestAnimationFrame(() => {
                headChange();
                scrollTimeout = null;
            });
        } 
    });
    
    let resizeTimeout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            responsiveScript();
            ScrollTrigger.refresh();
        }, 200);
    });

    responsiveScript();
});

