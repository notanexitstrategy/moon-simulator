import React, { useState } from "react";
import { Formik } from "formik";
import FormValidationSchema from "../validation/FormValidationSchema";
import Field from "./Field";
import DarkModeImage from "../images/dark-mode.png";
import LightModeImage from "../images/light-mode.png";

interface FormProps {
  shareQty: number;
  costBasis?: number;
  showFloor?: boolean;
  ceiling: number;
  floor?: number;
  increments?: number;
}

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const initialValues: FormProps = {
    shareQty: 10,
    costBasis: 40,
    ceiling: 10000000,
    floor: 100000,
    increments: 1,
    showFloor: false,
  };

  const renderNumber = (numberToRender: number) => {
    const natural = Math.floor(numberToRender);
    const decimal = parseFloat(
      numberToRender.toFixed(2).toString().split(".")[1]
    );

    return (
      <span>
        {natural.toLocaleString("en")}
        {decimal !== 0 && (
          <>
            .<sup>{decimal}</sup>
          </>
        )}
      </span>
    );
  };

  const getEarningsWithCeiling = (formValues: FormProps) => {
    const { shareQty, costBasis, ceiling, floor, increments } = formValues;
    const totalSharePrice = shareQty * ceiling;

    const calculateProfit = (totalPriceOfSoldShares: number) => {
      if (!costBasis) {
        return null;
      }

      const totalPriceOfOwnedShares = costBasis * shareQty;
      return (
        <p className="stonks-go-brr">
          Total gain:{" "}
          <strong>
            ${renderNumber(totalPriceOfSoldShares - totalPriceOfOwnedShares)}
          </strong>
        </p>
      );
    };

    if (shareQty <= 0) {
      return null;
    }

    if (!floor || !increments || increments < 2) {
      return (
        <React.Fragment>
          <p className="stonks-go-brr">
            The total value of your share{shareQty > 1 ? "s" : ""} if you sell
            everything at once:{" "}
            <strong>${renderNumber(totalSharePrice)}</strong>
          </p>
          {calculateProfit(totalSharePrice)}
        </React.Fragment>
      );
    } else {
      const ceilingFloorDiff = ceiling - floor;
      const stockPriceIncrementAmount = ceilingFloorDiff / (increments - 1);
      const sharesQuantityIncrementAmount = shareQty / increments;

      const incrementPrices = () => {
        var incrementArray: number[] = [];

        for (var i = 0; i < increments; i++) {
          const incrementValue = ceiling - stockPriceIncrementAmount * i;
          incrementArray.push(incrementValue);
        }

        return incrementArray;
      };

      const totalPriceOfShares = incrementPrices().reduce(
        (a, b) => a + b * sharesQuantityIncrementAmount,
        0
      );

      return (
        <React.Fragment>
          <p className="stonks-go-brr">
            Total value of sold shares:{" "}
            <strong>${renderNumber(totalPriceOfShares)}</strong>
          </p>
          {calculateProfit(totalPriceOfShares)}
          <ul>
            {incrementPrices().map((price: number) => {
              return (
                <li key={price.toString()}>
                  Sell{" "}
                  <strong>{sharesQuantityIncrementAmount.toFixed(2)}</strong>{" "}
                  shares at <strong>${renderNumber(price)}</strong> for a total
                  of{" "}
                  <strong>
                    ${renderNumber(sharesQuantityIncrementAmount * price)}
                  </strong>
                </li>
              );
            })}
          </ul>
        </React.Fragment>
      );
    }
  };

  return (
    <div className={`app-container theme-${darkMode ? "dark" : "light"}`}>
      <div className="page">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn-theme"
          title={darkMode ? "Sun stocks go up" : "Moon stocks go up"}
        >
          <img src={darkMode ? LightModeImage : DarkModeImage} alt="" />
        </button>

        <Formik
          initialValues={initialValues}
          validationSchema={FormValidationSchema}
          onSubmit={(values: FormProps) => {
            console.log(values);
          }}
        >
          {({ values, errors }) => (
            <form>
              <div className="form">
                My ceiling is
                <span>
                  $<Field name="ceiling" />
                </span>
                and I own
                <span>
                  <Field name="shareQty" />
                  shares
                </span>
                at an average price of
                <span>
                  $<Field name="costBasis" />
                  /share.
                </span>
                Once my target price is reached, I want to sell in&nbsp;
                <span>
                  <Field name="increments" />
                  increment
                  {values.increments && values.increments > 1 ? "s" : ""}
                </span>
                until the price reaches
                <span>
                  $
                  <Field name="floor" />
                </span>
              </div>
              {values.costBasis && (
                <React.Fragment>
                  {((values.ceiling && values.ceiling < values.costBasis) ||
                    (values.floor && values.floor < values.costBasis)) && (
                    <p className="error">Stonks only go up. &#128640;</p>
                  )}
                </React.Fragment>
              )}
              {values.increments && values.increments > 1 ? (
                <React.Fragment>
                  {errors?.floor?.startsWith("floor must be less") && (
                    <p className="error">
                      I am a simple ape, I eat crayola, but I'm pretty sure your
                      floor must be lower than your ceiling.
                    </p>
                  )}
                </React.Fragment>
              ) : null}
              {values !== initialValues && (
                <div className="earnings">{getEarningsWithCeiling(values)}</div>
              )}
            </form>
          )}
        </Formik>
        <p className="error">Not financial advice.</p>
      </div>
    </div>
  );
};

export default LandingPage;
