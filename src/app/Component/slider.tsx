"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
export default function Slider() {      
    const progressRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const swiper = document.querySelector(".swiper")?.swiper;

        if (swiper) {
            swiper.params.navigation.prevEl = ".swiper-button-prev";
            swiper.params.navigation.nextEl = ".swiper-button-next";
            swiper.params.pagination.el = ".swiper-pagination";

            swiper.on("autoplayTimeLeft", (_s: any, _time: any, progress: number) => {
                if (progressRef.current) {
                    progressRef.current.style.width = `${(1 - progress) * 100}%`;
                }
            });

            swiper.navigation.init();
            swiper.navigation.update();
            swiper.pagination.init();
            swiper.pagination.update();
        }
    }, []);
    return (
          <div className="section_slider">
            <div className="swiper-container swiper-container-fade swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events swiper-fade swiper-initialized swiper-horizontal swiper-watch-progress swiper-backface-hidden">
                <Swiper
                    modules={[Navigation, Pagination, EffectFade, Autoplay]}
                    effect="fade"
                    loop
                    // navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    className="swiper-container-fade"
                >
                    <div className="swiper-wrapper" style={{ transitionDuration: "0ms" }} id="swiper-wrapper-54c5d3d62fd9c34b" aria-live="off">
                        <SwiperSlide>

                    <div className="swiper-slide swiper-slide-next"  role="group" aria-label="3 / 3" data-swiper-slide-index="2">
                        <a href="sanpham.html" className="clearfix" title="Slider 3">
                            <img width="1920" height="600" src="/img/slider_3.jpg" alt="Slider 3" className="img-responsive center-block duration-300"/>
                        </a>
                            </div>    
                            </SwiperSlide>
                        <SwiperSlide>
                    <div className="swiper-slide swiper-slide-prev" role="group" aria-label="1 / 3" data-swiper-slide-index="0">
                        <a href="sanpham.html" className="clearfix" title="Slider 1">
                            <img width="1920" height="600" src="/img/slider_1.webp" alt="Slider 1" className="img-responsive center-block duration-300"/>
                        </a>                                                                        
                    </div>
                            </SwiperSlide>
                             <SwiperSlide>
                            <div className="swiper-slide swiper-slide-visible swiper-slide-active" role="group" aria-label="2 / 3" data-swiper-slide-index="1">
                        <a href="sanpham.html" className="clearfix" title="Slider 2">
                            <img width="1920" height="600" src="/img/slider_2.jpg" alt="Slider 2" className="img-responsive center-block duration-300"/>
                        </a>
                        </div>
                         </SwiperSlide>
                    </div>
                {/* <!-- nút bấm chuyển slider --> */}
                <div className="swiper-button-prev" tabIndex={0} role="button" aria-label="Previous slide" aria-controls="swiper-wrapper-54c5d3d62fd9c34b">
                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
                        <rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
                        <path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        </path>
                        <path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </div>
                <div className="swiper-button-next" tabIndex={0} role="button" aria-label="Next slide" aria-controls="swiper-wrapper-54c5d3d62fd9c34b">
                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2.13003" y="29" width="38" height="38" transform="rotate(-45 2.13003 29)" stroke="black" fill="#fff" strokeWidth="2"></rect>
                        <rect x="8" y="29.2133" width="30" height="30" transform="rotate(-45 8 29.2133)" fill="black"></rect>
                        <path d="M18.5 29H39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        </path>
                        <path d="M29 18.5L39.5 29L29 39.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </div>
                {/* <!-- nút bấm chuyển slider --> */}
                    <div className="swiper-pagination"></div>
                {/* <!-- thanh chạy slider --> */}
                    {/* progress bar */}
                    <div className="swiper-progress-bar">
                        <div
                            ref={progressRef}
                            className="progress"
                            style={{ width: "100%" }}
                        ></div>
                    </div>

                    <span
                        className="swiper-notification"
                        aria-live="assertive"
                        aria-atomic="true"
                    ></span>
                </Swiper>
            </div>
            </div>
            
    );
}