import React from 'react';
import SideMenu from './sideMenu';
import '../Styles/sideMenu.css';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/home.css'; 

const Home = () => {
    return (
        <div>
            <div className="area">

            <Carousel interval={30000}>
                <Carousel.Item>
                    <div className="fill" style={{ backgroundImage: "url('https://wallpaperaccess.com/full/368911.jpg')" }}></div>
                    <Carousel.Caption>
                        <h2 className="animated fadeInLeft">FarmaTech</h2>
                        <p className="animated fadeInUp">Un buen sistema es el reflejo de un equipo unido y comprometido.</p>
                        <p className="animated fadeInUp"></p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="fill" style={{ backgroundImage: "url('https://wallpaperaccess.com/full/368940.jpg')" }}></div>
                    <Carousel.Caption>
                        <h2 className="animated fadeInDown">FarmaTech</h2>
                        <p className="animated fadeInUp">La colaboración es la clave para resolver los problemas más complejos.</p>
                        <p className="animated fadeInUp"></p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="fill" style={{ backgroundImage: "url('https://wallpaperaccess.com/full/663607.jpg')" }}></div>
                    <Carousel.Caption>
                        <h2 className="animated fadeInRight">FarmaTech</h2>
                        <p className="animated fadeInRight">Cada desafío es una oportunidad para aprender y crecer</p>
                        <p className="animated fadeInUp"></p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            </div>
            <SideMenu />
            
        </div>
    );
}

export default Home;