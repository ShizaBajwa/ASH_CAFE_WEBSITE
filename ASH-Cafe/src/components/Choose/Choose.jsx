import React from "react";
import chooseImg from "../../assets/images/choose.jpg";
import coffeeMug from "../../assets/images/coffee-mug.svg";
import coffeeBeans2 from "../../assets/images/coffee-beans-2.svg";
import coffeeBeans3 from "../../assets/images/coffee-beans-3.svg";
import "./choose.css";

const Choose = () => {
  return (
    <section className="choose section">
      <div className="choose__grid container grid">
        <div className="choose__content">
          <h2 className="section__title title-left" data-title="Why Choose Us">
            Experience Coffee Like Never Before!
          </h2>
          <p className="choose__description">
            At ASH Cafe, we believe in more than just a great cup of coffee. Our
            dedication to quality, sustainability, and community shines through
            in every sip. Sourced from the finest beans, expertly roasted, and
            carefully brewed, our coffee offers a rich and smooth flavor
            experience that’s unmatched.
          </p>

          <div className="choose__details grid">
            <div className="choose__details-item">
              <div className="choose__details-img-wrapper">
                <img
                  src={coffeeMug}
                  alt="coffee mug"
                  className="choose__details-img"
                />
              </div>
              <div>
                <h3 className="choose__details-title">Premium Quality Beans</h3>
                <p className="choose__details-description">
                  We source only the finest beans from around the world,
                  ensuring each cup delivers a rich, bold flavor that true
                  coffee lovers crave.
                </p>
              </div>
            </div>

            <div className="choose__details-item">
              <div className="choose__details-img-wrapper">
                <img
                  src={coffeeBeans2}
                  alt="coffee beans"
                  className="choose__details-img"
                />
              </div>
              <div>
                <h3 className="choose__details-title">
                  Sustainably Sourced & Ethically Produced
                </h3>
                <p className="choose__details-description">
                  We are committed to sustainability and ethical practices,
                  partnering directly with farmers who use
                  environmentally-friendly methods.
                </p>
              </div>
            </div>

            <div className="choose__details-item">
              <div className="choose__details-img-wrapper">
                <img
                  src={coffeeBeans3}
                  alt="coffee beans"
                  className="choose__details-img"
                />
              </div>
              <div>
                <h3 className="choose__details-title">
                  Crafted for Your Enjoyment
                </h3>
                <p className="choose__details-description">
                  Every batch is crafted with passion and precision, from the
                  roasting process to the final brew.
                </p>
              </div>
            </div>
          </div>
        </div>
        <img src={chooseImg} alt="coffee" className="choose__img" />
      </div>
    </section>
  );
};

export default Choose;
