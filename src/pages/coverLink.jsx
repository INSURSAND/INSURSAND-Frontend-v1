import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";
import QuoteLink from "../components/QuoteLink";
import { AiOutlineArrowDown, AiOutlineSelect } from "react-icons/ai";
import { IoReaderOutline } from "react-icons/io5";
import { BALANCE_contract, NFT_contract } from "./covers";
import Terms from "../complex/terms";
const CoverLink = ({ account }) => {
  const [amount, setAmount] = useState(1);
  const [toUsdt, setToUsdt] = useState(1); // 입력받은 LINK가 usdt로 변환된 값
  const [linkPrice, setLinkPrice] = useState(null); // 현재 LINK 가격 조회
  const [activePrice, setActivePrice] = useState(); // 보험금을 청구할 수 있는 LINK 가격
  const [period, setPeriod] = useState(null); // 0(30) or 1(365)
  const [ratio, setRatio] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [votes, setVotes] = useState(0);
  const [totalRate, setTotalRate] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [coveragePeriod, setCoveragePeriod] = useState(0); // 30 or 365
  const [isChecked, setIsChecked] = useState(false);

  const calculateDiscount = () => {
    if (Number(amount) >= 5100) {
      var discountRatio = [((Number(amount) - 5000) / 100) * 0.001];
      setDiscount((Number(amount) * (Number(discountRatio) / 100)).toFixed(3));
    } else {
      setDiscount(0);
    }
  };

  const onClickToggle = () => {
    // 30
    setPeriod(0);
    setToggle(!toggle);
    setToggle2(false);
  };

  const onClickToggle2 = () => {
    // 365
    setPeriod(1);
    setToggle2(!toggle2);
    setToggle(false);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleChange = (e) => {
    setRatio(e.target.value);
  };

  const getLinkPrice = async () => {
    try {
      var linkPrices = await BALANCE_contract.methods.getLINKBalances().call();
      setLinkPrice((Number(linkPrices) / 1000).toFixed(3));
    } catch (error) {
      console.log(error);
    }
  };

  const getPeriod = async () => {
    try {
      if (period === 0) {
        setCoveragePeriod(30);
      } else if (period === 1) {
        setCoveragePeriod(365);
      } else {
        setCoveragePeriod(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFinalPrice = async () => {
    try {
      var finalPrices = await NFT_contract.methods
        .calculateCoverFee(period, ratio, amount)
        .call();
      setFinalPrice(finalPrices * (105 / 100));
    } catch (error) {
      console.log(error);
    }
  };

  const getVotes = async () => {
    try {
      if (finalPrice < 100) {
        setVotes(1);
      } else if (finalPrice <= 200) {
        setVotes(2);
      } else if (finalPrice > 200) {
        setVotes(3);
      } else {
        setVotes(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRate = async () => {
    try {
      const feeRate = await NFT_contract.methods
        .getCoverFees(period, ratio, amount)
        .call();
      setTotalRate((Number(feeRate) / 100).toFixed(3));
      setDailyRate((Number(feeRate) / 365 / 100).toFixed(3));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFinalPrice();
    getPeriod();
    getRate();
  }, [amount, period, ratio]);

  useEffect(() => {
    getVotes();
  }, [finalPrice]);

  useEffect(() => {
    calculateDiscount();
    getLinkPrice();
    setToUsdt((amount * linkPrice).toFixed(3));
    setActivePrice(Math.floor(linkPrice - (linkPrice * ratio) / 100));
    // console.log(activePrice);

    // console.log("discount: ", discount);
    // console.log(typeof Number(amount));

    console.log("LINK price: ", linkPrice);
  }, [amount, ratio]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-400/80 to-amber-600/80 pt-14 pb-20 font-nunito">
      <div className="mx-40 mt-24">
        <div>
          <Link to="/covers">
            <button>
              <div className="flex items-center">
                <BiArrowBack className="mr-1" />
                Back
              </div>
            </button>
          </Link>
          <div>
            <div className="mt-4 text-5xl text-amber-900 flex items-center gap-2">
              <img
                src={`${process.env.PUBLIC_URL}/images/link_logo.png`}
                alt="link"
                className="w-14"
              />
              Buy LINK Asset Cover
            </div>
            <div className="mt-3 text-lg text-amber-900/80">
              Enter the coverage amount(LINK) and Select the coverage period and
              the coverage ratio.
              <br />
              Then get the quote!
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col gap-12 w-2/3 mr-20">
            <div className="">
              <div className="mt-12 bg-white rounded-xl shadow-2xl h-full">
                <div className="p-6 text-2xl flex items-center gap-2">
                  <AiOutlineSelect />
                  Coverage Options
                </div>
                <div className="p-6">
                  · You can choose between two coverage options:&nbsp;
                  <div className="inline underline font-bold">30 days</div>{" "}
                  and&nbsp;
                  <div className="inline underline font-bold">365 days</div>.
                  <br /> <br />
                  · Please note that the fee rates may vary depending on the
                  chosen duration,
                  <br /> and the coverage amount will also be calculated
                  differently based on the chosen coverage amount and duration.
                  <br />
                  <br />· If the price declines to the user-inputted coverage
                  decline rate, which can range&nbsp;
                  <div className="inline underline font-bold">
                    from 10% to 90%
                  </div>
                  ,
                  <br />
                  you will be eligible to receive the insurance payout.
                  <br />
                  <br /> · There is a discount available for the total payment
                  amount.
                  <br />{" "}
                  <div className="inline underline font-bold">
                    For payments totaling 5,000 LINK or more, there will be a
                    discount of 0.001% for every 100 LINK increment.
                  </div>
                  <br />
                  <br /> ·&nbsp;
                  <div className="inline underline">
                    the coverage amount will also be calculated differently
                    based on the chosen coverage amount and duration.
                  </div>
                  <br />
                  <br />· If the final payment amount is less than 100 USDT, you
                  will receive 1 voting right. If it is between 100 and 200 USDT
                  (inclusive), you will receive 2 voting rights. If it exceeds
                  200 USDT, you will receive 3 voting rights.
                  <br />
                  <br />·{" "}
                  <div className="inline underline">
                    The claimable amount will vary based on the decline rate.
                  </div>
                </div>
                <div className="p-6 flex justify-evenly gap-4">
                  <div className="border rounded-xl w-1/2">
                    <div className="text-xl flex justify-center pt-4">
                      <u>Coverage Period (days)</u>
                    </div>
                    <div className="flex mt-3 gap-10 p-4 justify-around">
                      <button
                        className={`rounded-3xl p-8 border-2 transition duration-300 hover:scale-95 hover:text-blue-600/50 hover:border-blue-500/50 hover:bg-blue-100/50 ${
                          toggle &&
                          "bg-blue-100 border-blue-500 text-blue-600 hover:text-blue-600/50 hover:border-blue-500/50 hover:bg-blue-100/50"
                        }`}
                        onClick={onClickToggle}
                      >
                        30 days
                      </button>
                      <button
                        className={`rounded-3xl p-8 border-2 transition duration-300 hover:scale-95 hover:text-blue-600/50 hover:border-blue-500/50 hover:bg-blue-100/50 ${
                          toggle2 &&
                          "bg-blue-100 border-blue-500 text-blue-600 hover:text-blue-600/50 hover:border-blue-500/50 hover:bg-blue-100/50"
                        }`}
                        onClick={onClickToggle2}
                      >
                        365 days
                      </button>
                    </div>
                  </div>
                  <div className="w-1/2 border rounded-xl">
                    <div className="text-xl flex justify-center pt-4">
                      <u>Coverage Amount (LINK)</u>
                    </div>
                    {/* <div className="flex justify-end mr-12">
                      {period === null ? <div>enter period!</div> : <div></div>}
                    </div> */}
                    <div className="p-5 flex flex-col">
                      <div className="flex items-center gap-4">
                        <input
                          placeholder="0"
                          type="number"
                          className="p-4 pr-4 text-lg flex w-3/5"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          style={{ textAlign: "right" }}
                        ></input>
                        <span className="text-lg text-amber-800">LINK</span>
                      </div>
                      <div className="flex items-center ml-3 mt-2 mb-2 justify-center">
                        <AiOutlineArrowDown size={24} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-4 pr-4 text-lg flex justify-end w-3/5">
                          {toUsdt}
                        </div>
                        <span className="text-lg text-amber-800">USDT</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex">
                  <div className="border rounded-xl w-full">
                    <div className="text-xl flex justify-center pt-4">
                      <u>Coverage Ratio (%)</u>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-64 mt-4 flex items-center gap-8 mb-4">
                        <input
                          type="range"
                          min={10}
                          max={90}
                          step={1}
                          value={ratio}
                          onChange={handleChange}
                          className="h-5 bg-gray-300 rounded-full w-full outline-none"
                        />
                        <div className="text-center">{ratio}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Terms />
          </div>
          <div className="w-1/3 h-full top-10 sticky">
            <div className="mt-12 top-0 sticky bg-white rounded-xl shadow-2xl shadow-amber-800/80 flex flex-col">
              <div className="pl-6 pt-4 text-2xl flex items-center gap-2">
                <IoReaderOutline />
                Receipt
              </div>
              <div className="mx-8">
                <div className="border mt-4 rounded-xl">
                  <div className="p-4 font-bold">
                    <u>Request</u>
                  </div>
                  <div className="flex justify-between p-3 mx-8 text-sm">
                    <div>coverage period:</div>
                    <div className="font-bold">{coveragePeriod} days</div>
                  </div>
                  <div className="flex justify-between p-3 mx-8 text-sm">
                    <div>coverage amount:</div>
                    <div className="font-bold">{amount} LINK</div>
                  </div>
                  <div className="flex justify-between p-3 mx-8 text-sm">
                    <div>coverage ratio:</div>
                    <div className="font-bold">{ratio}%</div>
                  </div>
                </div>
                <div className="border mt-8 rounded-xl">
                  <div className="p-4 font-bold">
                    <u>Quote</u>
                  </div>
                  <div className="flex justify-between p-3 mx-8 text-sm">
                    <div>discount amount:</div>
                    <div className="font-bold">{discount} USDT</div>
                  </div>
                  <div className="flex justify-between p-3 mx-8 text-sm">
                    <div>amount you'll pay:</div>
                    <div className="font-bold">{finalPrice} USDT</div>
                  </div>
                  <div className="flex justify-between p-3 mx-8 text-sm">
                    <div>claimable amount:</div>
                    <div className="font-bold">{activePrice} USDT</div>
                  </div>
                  <div className="flex justify-between p-3 mx-8 text-sm">
                    <div>votes you'll receive:</div>
                    <div className="font-bold">{votes}</div>
                  </div>
                  <div className="flex-grow flex justify-between p-3 mx-8 text-sm">
                    <div>fee rate:</div>
                    <div className="flex font-bold">
                      <div>{totalRate}% (total)</div>
                      <div className="mx-1"> | </div>
                      <div>{dailyRate}% (daily)</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-center mt-6">
                  {
                    <QuoteLink
                      finalPrice={finalPrice}
                      period={period}
                      account={account}
                      amount={amount}
                      isChecked={isChecked}
                      ratio={ratio}
                      linkPrice={linkPrice}
                      activePrice={activePrice}
                    />
                  }
                </div>
                <label
                  className={
                    "flex justify-center items-center gap-2 text-xs font-bold mb-6"
                  }
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  I have read and agreed to the terms and conditions.
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLink;
