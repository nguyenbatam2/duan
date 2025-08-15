import Link from "next/link";
import '@/app/styles/gioi-thieu.css';
export default function GioiThieu() {
    return (
        <>
            <div className="container_about">
                <section className="bread-crumb">
                    <div className="container">
                        <ul className="breadcrumb">
                            <li className="home">
                                <Link href="/" title="Trang chủ"><span>Trang chủ</span></Link>
                                <span className="mr_lr">&nbsp;<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-chevron-right fa-w-10">
                                    <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" className=""></path>
                                </svg>&nbsp;</span>
                            </li>

                            <li><strong><span>Giới thiệu</span></strong></li>

                        </ul>
                    </div>
                </section>

                <div className="container_book">
                    <h1 className="h1" style={{ fontWeight: "600", marginBottom: "8%" }}>Giới Thiệu</h1>
                    <div className="book_img-logo">
                        <img src="/img/logo_gioithieu.png" alt="" />
                    </div>
                    <p>Như quý vị đã biết: "Tài sản lớn nhất của đời người
                        là sức khỏe và trí tuệ", có sức khỏe và trí tuệ thì
                        sẽ có tất cả. Sản phẩm yến sào là thực phẩm bổ dưỡng
                        mang lại cho Quý vị <br /> sức khỏe, trí tuệ và sự trẻ trung.
                        Yến sào được thị trường đón nhận với phương châm:
                        "Chất lượng uy tín là thương hiệu". <br /> Sản phẩm yến sào của
                        Yến sào được khai thác và yến nuôi tổ với chất lượng tuyệt đối...</p>
                    <p><br />
                        Sản phẩm yến sào của Yến sào <b>Bird's Nest</b> được khai thác và yến nuôi tổ với chất lượng tuyệt đối...
                    </p><br />
                    <p>
                        <b>Bird's Nest</b> đến nay đã chiếm trọn niềm tin của khách hàng bởi chất lượng - tinh tế - hợp khẩu vị trong từng
                        dòng sản phẩm về Yến sào.<br />
                        <b>Bird's Nest</b> luôn mang đến cho quý khách hàng những sản phẩm chất lượng nhất - tốt nhất - tinh hoa nhất với
                        đội ngũ chuyên gia nghiên cứu dinh dưỡng hàng<br />
                        đầu Việt Nam và luôn đầu tư dây chuyền sản xuất công nghệ cao, hiện đại, quy mô sản xuất lớn.
                    </p>
                    <div className="book_img">
                        <img src="/img/gioithieu.png" alt="" />
                    </div>
                </div>
            </div>
        </>
    );
}