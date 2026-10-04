import React, { useState } from "react";

import "./ConferenceEvent.css";

import TotalCost from "./TotalCost";

import {
  toggleMealSelection
} from "./mealsSlice";

import {
  incrementAvQuantity,
  decrementAvQuantity
} from "./avSlice";

import {
  useSelector,
  useDispatch
} from "react-redux";

import {
  incrementQuantity,
  decrementQuantity
} from "./venueSlice";


const ConferenceEvent = () => {

  const [showItems, setShowItems] =
    useState(false);

  const [numberOfPeople, setNumberOfPeople] =
    useState(1);

  const venueItems = useSelector(
    state => state.venue
  );

  const avItems = useSelector(
    state => state.av
  );

  const mealsItems = useSelector(
    state => state.meals
  );

  const dispatch = useDispatch();


  /* ---------------- VENUE ---------------- */

  const handleAddToCart = (index) => {

    if (
      venueItems[index].name ===
      "Auditorium Hall (Capacity:200)" &&
      venueItems[index].quantity >= 3
    ) {
      return;
    }

    if (
      venueItems[index].name !==
      "Auditorium Hall (Capacity:200)" &&
      venueItems[index].quantity >= 10
    ) {
      return;
    }

    dispatch(
      incrementQuantity(index)
    );
  };


  const handleRemoveFromCart = (index) => {

    if (
      venueItems[index].quantity > 0
    ) {
      dispatch(
        decrementQuantity(index)
      );
    }
  };


  /* ---------------- ADD-ONS ---------------- */

  const handleIncrementAvQuantity = (index) => {

    dispatch(
      incrementAvQuantity(index)
    );
  };


  const handleDecrementAvQuantity = (index) => {

    dispatch(
      decrementAvQuantity(index)
    );
  };


  /* ---------------- MEALS ---------------- */

  const handleMealSelection = (index) => {

    dispatch(
      toggleMealSelection(index)
    );
  };


  /* ---------------- ITEMS FOR TABLE ---------------- */

  const getItemsFromTotalCost = () => {

    const items = [];


    venueItems.forEach(item => {

      if (item.quantity > 0) {

        items.push({
          ...item,
          type: "venue"
        });

      }

    });


    avItems.forEach(item => {

      if (item.quantity > 0) {

        items.push({
          ...item,
          type: "av"
        });

      }

    });


    mealsItems.forEach(item => {

      if (item.selected) {

        items.push({
          ...item,
          type: "meals"
        });

      }

    });


    return items;
  };


  const items =
    getItemsFromTotalCost();


  /* ---------------- TABLE ---------------- */

  const ItemsDisplay = ({ items }) => {

    return (

      <div className="display_box1">

        {items.length === 0 && (
          <p>No items selected</p>
        )}

        <table className="table_item_data">

          <thead>

            <tr>
              <th>Name</th>
              <th>Unit Cost</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr key={index}>

                <td>
                  {item.name}
                </td>

                <td>
                  ${item.cost}
                </td>

                <td>

                  {item.type === "meals"
                    ? `For ${numberOfPeople} people`
                    : item.quantity}

                </td>

                <td>

                  {item.type === "meals"
                    ? `$${item.cost * numberOfPeople}`
                    : `$${item.cost * item.quantity}`}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    );
  };


  /* ---------------- TOTAL CALCULATION ---------------- */

  const calculateTotalCost = section => {

    let totalCost = 0;


    if (section === "venue") {

      venueItems.forEach(item => {

        totalCost +=
          item.cost *
          item.quantity;

      });

    }


    else if (section === "av") {

      avItems.forEach(item => {

        totalCost +=
          item.cost *
          item.quantity;

      });

    }


    else if (section === "meals") {

      mealsItems.forEach(item => {

        if (item.selected) {

          totalCost +=
            item.cost *
            numberOfPeople;

        }

      });

    }


    return totalCost;
  };


  const venueTotalCost =
    calculateTotalCost("venue");

  const avTotalCost =
    calculateTotalCost("av");

  const mealsTotalCost =
    calculateTotalCost("meals");


  const totalCosts = {

    venue: venueTotalCost,

    av: avTotalCost,

    meals: mealsTotalCost

  };


  /* ---------------- NAVIGATION ---------------- */

  const navigateToProducts = idType => {

    if (
      idType === "#venue" ||
      idType === "#addons" ||
      idType === "#meals"
    ) {

      if (showItems) {
        setShowItems(false);
      }

    }

  };


  return (

    <>

      <navbar className="navbar_event_conference">

        <div className="company_logo">
          Conference Expense Planner
        </div>


        <div className="left_navbar">

          <div className="nav_links">

            <a
              href="#venue"
              onClick={() =>
                navigateToProducts("#venue")
              }
            >
              Venue
            </a>


            <a
              href="#addons"
              onClick={() =>
                navigateToProducts("#addons")
              }
            >
              Add-ons
            </a>


            <a
              href="#meals"
              onClick={() =>
                navigateToProducts("#meals")
              }
            >
              Meals
            </a>

          </div>


          <button
            className="details_button"
            onClick={() =>
              setShowItems(!showItems)
            }
          >
            Show Details
          </button>

        </div>

      </navbar>


      <div className="main_container">

        {!showItems ? (

          <div className="items-information">


            {/* ================= VENUE ================= */}

            <div
              id="venue"
              className="venue_container container_main"
            >

              <div className="text">

                <h1>
                  Venue Room Selection
                </h1>

              </div>


              <div className="venue_selection">

                {venueItems.map(
                  (item, index) => (

                    <div
                      className="venue_main"
                      key={index}
                    >

                      <div className="img">

                        <img
                          src={item.img}
                          alt={item.name}
                        />

                      </div>


                      <div className="text">

                        {item.name}

                      </div>


                      <div>

                        ${item.cost}

                      </div>


                      <div className="button_container">

                        <button
                          className={
                            item.quantity === 0
                              ? "btn-warning btn-disabled"
                              : "btn-warning btn-plus"
                          }

                          onClick={() =>
                            handleRemoveFromCart(
                              index
                            )
                          }
                        >
                          &#8211;
                        </button>


                        <span className="selected_count">

                          {item.quantity}

                        </span>


                        <button
                          className={
                            (
                              item.name ===
                              "Auditorium Hall (Capacity:200)"
                              && item.quantity >= 3
                            ) ||
                            (
                              item.name !==
                              "Auditorium Hall (Capacity:200)"
                              && item.quantity >= 10
                            )
                              ? "btn-success btn-disabled"
                              : "btn-success btn-plus"
                          }

                          onClick={() =>
                            handleAddToCart(
                              index
                            )
                          }
                        >
                          &#43;
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>


              <div className="total_cost">

                Total Cost: ${venueTotalCost}

              </div>

            </div>


            {/* ================= ADD-ONS ================= */}

            <div
              id="addons"
              className="venue_container container_main"
            >

              <div className="text">

                <h1>
                  Add-ons Selection
                </h1>

              </div>


              <div className="addons_selection">

                {avItems.map(
                  (item, index) => (

                    <div
                      className="av_data venue_main"
                      key={index}
                    >

                      <div className="img">

                        <img
                          src={item.img}
                          alt={item.name}
                        />

                      </div>


                      <div className="text">

                        {item.name}

                      </div>


                      <div>

                        ${item.cost}

                      </div>


                      <div className="addons_btn">

                        <button
                          className={
                            item.quantity === 0
                              ? "btn-warning btn-disabled"
                              : "btn-warning"
                          }

                          onClick={() =>
                            handleDecrementAvQuantity(
                              index
                            )
                          }
                        >
                          &ndash;
                        </button>


                        <span className="quantity-value">

                          {item.quantity}

                        </span>


                        <button
                          className="btn-success"
                          onClick={() =>
                            handleIncrementAvQuantity(
                              index
                            )
                          }
                        >
                          &#43;
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>


              <div className="total_cost">

                Total Cost: ${avTotalCost}

              </div>

            </div>


            {/* ================= MEALS ================= */}

            <div
              id="meals"
              className="venue_container container_main"
            >

              <div className="text">

                <h1>
                  Meals Selection
                </h1>

              </div>


              <div className="input-container venue_selection">

                <label htmlFor="numberOfPeople">

                  <h3>
                    Number of People:
                  </h3>

                </label>


                <input
                  type="number"
                  className="input_box5"
                  id="numberOfPeople"
                  value={numberOfPeople}
                  min="1"

                  onChange={e => {

                    const value =
                      parseInt(
                        e.target.value
                      );

                    setNumberOfPeople(
                      value > 0 ? value : 1
                    );

                  }}

                />

              </div>


              <div className="meal_selection">

                {mealsItems.map(
                  (item, index) => (

                    <div
                      className="meal_item"
                      key={index}
                    >

                      <div className="inner">

                        <input
                          type="checkbox"
                          id={`meal_${index}`}
                          checked={item.selected}

                          onChange={() =>
                            handleMealSelection(
                              index
                            )
                          }
                        />


                        <label
                          htmlFor={`meal_${index}`}
                        >
                          {item.name}
                        </label>

                      </div>


                      <div className="meal_cost">

                        ${item.cost}

                      </div>

                    </div>

                  )
                )}

              </div>


              <div className="total_cost">

                Total Cost: ${mealsTotalCost}

              </div>

            </div>

          </div>

        ) : (

          <div className="total_amount_detail">

            <TotalCost
              totalCosts={totalCosts}

              ItemsDisplay={() => (
                <ItemsDisplay
                  items={items}
                />
              )}
            />

          </div>

        )}

      </div>

    </>
  );
};

export default ConferenceEvent;