import { useState } from "react";

export default function App() {
  const [step, setStep] = useState("home");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [callTime, setCallTime] = useState(300);
  const [history, setHistory] = useState([]);
  const [paymentDone, setPaymentDone] = useState(false);

  const goNext = (next) => {
    setHistory((prev) => [...prev, step]);
    setStep(next);
  };

  const goBack = () => {
    if (step === "otp") return setStep("kyc");
    if (step === "kyc") return setStep("profile");
    if (step === "profile") return setStep("home");
    if (step === "selfie") return setStep("kyc");
    if (step === "payment") return setStep("kyc");

    const prev = history[history.length - 1];
    if (prev) setStep(prev);
  };

  const goHome = () => {
    setStep("home");
    setHistory([]);
    setSelected(null);
    setMessage("");
    setSelfieTaken(false);
  };

  const consultants = [
    {
      id: 1,
      name: "Abhijit Tiwari",
      role: "Political Consultant",
      price: 499,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    {
      id: 2,
      name: "Kunjan Suleja",
      role: "Education Expert",
      price: 699,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
    },
    {
      id: 3,
      name: "Neha Kapoor",
      role: "Career Coach",
      price: 599,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    }
  ];

  const sendOTP = () => {
    setMessage("OTP Sent 📲");
    setTimeout(() => goNext("otp"), 1200);
  };

  const verifyOTP = () => {
    setMessage("OTP Verified ✅");
    setTimeout(() => goNext("selfie"), 1200);
  };

  const confirmSelfie = () => {
    setMessage("Selfie Verified 🎉");
    setTimeout(() => goNext("payment"), 1200);
  };

  const makePayment = () => {
    setMessage("Payment Successful 💰");
    setPaymentDone(true);
    setTimeout(() => goNext("success"), 1200);
  };

  const startCall = () => {
    if (!paymentDone) return;

    setCallTime(300);
    goNext("call");

    const interval = setInterval(() => {
      setCallTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          goNext("end");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div style={appBg}>

      {/* NAV */}
      <div style={topNav}>
        <button style={homeBtn} onClick={goHome}>Home</button>

        {!["home", "call", "end"].includes(step) && (
          <button style={backBtn} onClick={goBack}>Back</button>
        )}
      </div>

      {message && <div style={toast}>{message}</div>}

      {/* HOME */}
      {step === "home" && (
        <div style={grid}>
          {consultants.map((c) => (
            <div key={c.id} style={card}>
              <img src={c.image} style={img} />
              <h3 style={title}>{c.name}</h3>
              <p style={sub}>{c.role}</p>
              <p style={price}>₹{c.price}/min</p>

              <button
                style={btn}
                onClick={() => {
                  setSelected(c);
                  goNext("profile");
                }}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PROFILE */}
      {step === "profile" && selected && (
        <div style={box}>
          <img src={selected.image} style={bigImg} />
          <h2 style={title}>{selected.name}</h2>
          <p style={sub}>{selected.role}</p>

          <button style={btn} onClick={() => goNext("kyc")}>
            Continue
          </button>
        </div>
      )}

      {/* KYC */}
      {step === "kyc" && (
        <div style={box}>
          <h2 style={title}>KYC Form</h2>

          <input placeholder="Name" style={input} />
          <input placeholder="State" style={input} />
          <input placeholder="District" style={input} />
          <input placeholder="Village" style={input} />
          <input placeholder="PIN Code" style={input} />
          <input placeholder="Mobile Number" style={input} />

          <button style={otpBtn} onClick={sendOTP}>
            Send OTP
          </button>
        </div>
      )}

      {/* OTP */}
      {step === "otp" && (
        <div style={box}>
          <h2 style={title}>OTP Verify</h2>
          <input placeholder="Enter OTP" style={input} />

          <button style={btn} onClick={verifyOTP}>
            Verify
          </button>
        </div>
      )}

     {/* 🔥 SELFIE FIXED */}
{step === "selfie" && (
  <div style={box}>
    <h2 style={title}>Live Selfie Verification</h2>

    <label style={cameraBox}>
      📷 Open Camera & Take Selfie
      <input
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          if (file.size > 5 * 1024 * 1024) {
            setMessage("Image too large, use smaller photo");
            setSelfieTaken(false);
            return;
          }

          setSelfieTaken(true);
          setMessage("Selfie captured ✅");
        }}
      />
    </label>

    {/* ✅ अब button सिर्फ तभी दिखेगा जब file मिले */}
    {selfieTaken === true && (
      <button
        style={btn}
        onClick={() => {
          confirmSelfie();
        }}
      >
        Confirm Selfie
      </button>
    )}
  </div>
)}

      {/* PAYMENT */}
      {step === "payment" && (
        <div style={box}>
          <h2 style={title}>Payment</h2>

          <button style={btn}>GPay</button>
          <button style={btn}>PhonePe</button>

          <button style={payBtn} onClick={makePayment}>
            Pay Now
          </button>
        </div>
      )}

      {/* SUCCESS */}
      {step === "success" && (
        <div style={box}>
          <h2 style={title}>Payment Done</h2>

          <button style={btn} onClick={startCall}>
            Call Now
          </button>
        </div>
      )}

      {/* CALL */}
      {step === "call" && (
        <div style={box}>
          <h2 style={title}>Call Running</h2>

          <h1 style={timer}>
            {Math.floor(callTime / 60)}:
            {String(callTime % 60).padStart(2, "0")}
          </h1>
        </div>
      )}

      {/* END */}
      {step === "end" && (
        <div style={box}>
          <h2 style={title}>Call Ended</h2>
        </div>
      )}

    </div>
  );
}

/* ===== STYLES ===== */

const appBg = {
  minHeight: "100vh",
  background: "#1e1f24",
  color: "#e6e6e6",
  fontFamily: "sans-serif"
};

const topNav = {
  position: "fixed",
  top: 10,
  left: 10,
  display: "flex",
  gap: 10
};

const homeBtn = {
  padding: "10px 14px",
  background: "#2f3138",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: 8
};

const backBtn = {
  padding: "10px 14px",
  background: "#2a2c33",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: 8
};

const grid = {
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
  justifyContent: "center",
  paddingTop: 90
};

const card = {
  background: "#2a2c33",
  padding: 18,
  width: 220,
  borderRadius: 14,
  textAlign: "center",
  border: "1px solid #3a3d46"
};

const img = { width: 110, height: 130, borderRadius: 10 };

const box = {
  maxWidth: 420,
  margin: "90px auto",
  padding: 20,
  background: "#2a2c33",
  borderRadius: 14,
  border: "1px solid #3a3d46",
  textAlign: "center"
};

const input = {
  width: "100%",
  padding: 12,
  marginTop: 8,
  borderRadius: 10,
  border: "1px solid #444",
  background: "#1e1f24",
  color: "#fff"
};

const btn = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  background: "#4caf50",
  border: "none",
  borderRadius: 10,
  color: "#fff"
};

const otpBtn = {
  marginTop: 10,
  padding: 10,
  background: "#ff9800",
  border: "none",
  borderRadius: 8,
  color: "#000"
};

const payBtn = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  background: "#2196f3",
  border: "none",
  borderRadius: 10,
  color: "#fff"
};

const cameraBox = {
  display: "block",
  padding: 25,
  marginTop: 15,
  background: "#1e1f24",
  border: "2px dashed #4caf50",
  borderRadius: 12,
  cursor: "pointer",
  color: "#fff"
};

const title = { color: "#f1f1f1" };
const sub = { color: "#b5b5b5" };
const price = { color: "#00e676" };
const bigImg = { width: 150, height: 180, borderRadius: 12 };
const timer = { color: "#00e676", fontSize: 44 };

const toast = {
  position: "fixed",
  top: 20,
  right: 20,
  background: "#4caf50",
  padding: 10,
  borderRadius: 8,
  color: "#fff"
};
