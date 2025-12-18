import { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaCheck,
  FaRedo,
} from "react-icons/fa";
import { Terminal, Phone } from "lucide-react";
import "./ComplaintForm.css";

// OTP Modal Component
const OtpModal = ({ otp, onClose }) => {
  return (
    <div className="com-form-modal-overlay">
      <div className="com-form-modal-content">
        <div className="com-form-modal-header">
          <FaLock className="com-form-modal-icon" />
          <h3>OTP Verification</h3>
        </div>
        <div className="com-form-modal-body">
          <p>Your One-Time Password (OTP) is:</p>
          <div className="com-form-otp-display">
            {otp.split("").map((digit, index) => (
              <div key={index} className="com-form-otp-digit">
                {digit}
              </div>
            ))}
          </div>
          <p className="com-form-otp-note">
            This OTP is valid for 10 minutes. Please enter this code in the OTP
            field.
          </p>
        </div>
        <div className="com-form-modal-footer">
          <button className="com-form-btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Captcha Generator Component
const CaptchaGenerator = ({ onCaptchaGenerated }) => {
  const [captchaText, setCaptchaText] = useState("");

  const generateCaptcha = () => {
    const canvas = document.getElementById("captchaCanvas");
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not available");
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#020610";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCaptchaText(text);
    onCaptchaGenerated(text);

    ctx.font = "bold 24px monospace";
    ctx.fillStyle = "#00ffaa";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(0, 255, 170, ${Math.random() * 0.3})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3,
        Math.random() * 3
      );
    }

    for (let i = 0; i < text.length; i++) {
      ctx.save();
      ctx.translate(20 + i * 25, canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 255, 170, ${Math.random() * 0.5})`;
      ctx.lineWidth = 1;
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="com-form-captcha-container">
      <canvas
        id="captchaCanvas"
        width={180}
        height={60}
        className="com-form-captcha-canvas"
      />
      <button
        type="button"
        className="com-form-captcha-refresh"
        onClick={generateCaptcha}
        aria-label="Refresh captcha"
      >
        <FaRedo />
      </button>
    </div>
  );
};

// Login Form Component
const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    loginId: "",
    mobileNo: "",
    otp: "",
    captchaInput: "",
  });
  const [errors, setErrors] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSendOtp = () => {
    if (!formData.mobileNo) {
      setErrors({
        ...errors,
        mobileNo: "Mobile number is required",
      });
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNo)) {
      setErrors({
        ...errors,
        mobileNo: "Mobile number should be 10 digits",
      });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setShowOtpModal(true);
  };

  const handleCaptchaGenerated = (text) => {
    setCaptchaText(text);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.loginId.trim()) {
      newErrors.loginId = "Login ID / Email ID is required";
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Mobile number should be 10 digits";
    }

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp !== generatedOtp) {
      newErrors.otp = "Invalid OTP";
    }

    if (!formData.captchaInput.trim()) {
      newErrors.captchaInput = "Captcha is required";
    } else if (formData.captchaInput !== captchaText) {
      newErrors.captchaInput = "Invalid captcha";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        onLoginSuccess({
          loginId: formData.loginId,
          mobileNo: formData.mobileNo,
        });
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="com-form-form-step">
      <div className="com-form-step-header">
        <FaLock className="com-form-step-icon" />
        <h2>Citizen Login</h2>
      </div>
      <p className="com-form-step-description">
        Enter your credentials to access the cybercrime reporting system.
      </p>

      <form>
        <div className="com-form-form-grid">
          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="loginId">
              Login Id | Email Id<span className="com-form-required">*</span>
            </label>
            <input
              type="text"
              id="loginId"
              name="loginId"
              placeholder="Your Login Id/ Email Id"
              value={formData.loginId}
              onChange={handleChange}
              className={errors.loginId ? "error" : ""}
            />
            {errors.loginId && (
              <span className="com-form-error-message">{errors.loginId}</span>
            )}
          </div>

          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="mobileNo">
              Mobile No <span className="com-form-required">*</span>
            </label>
            <div className="com-form-mobile-input-container">
              <div className="com-form-country-code">+91</div>
              <input
                type="text"
                id="mobileNo"
                name="mobileNo"
                placeholder="Mobile No."
                value={formData.mobileNo}
                onChange={handleChange}
                className={errors.mobileNo ? "error" : ""}
              />
            </div>
            {errors.mobileNo && (
              <span className="com-form-error-message">{errors.mobileNo}</span>
            )}
            <button
              type="button"
              className="com-form-btn-outline com-form-send-otp-btn"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>

          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="otp">
              OTP <span className="com-form-required">*</span>
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Your OTP Number"
              value={formData.otp}
              onChange={handleChange}
              className={errors.otp ? "error" : ""}
            />
            {errors.otp && (
              <span className="com-form-error-message">{errors.otp}</span>
            )}
          </div>

          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="captchaInput">
              Enter Captcha <span className="com-form-required">*</span>
            </label>
            <CaptchaGenerator onCaptchaGenerated={handleCaptchaGenerated} />
            <input
              type="text"
              id="captchaInput"
              name="captchaInput"
              placeholder="Enter the captcha shown above"
              value={formData.captchaInput}
              onChange={handleChange}
              className={errors.captchaInput ? "error" : ""}
            />
            {errors.captchaInput && (
              <span className="com-form-error-message">
                {errors.captchaInput}
              </span>
            )}
          </div>
        </div>

        <div className="com-form-form-buttons">
          <button
            type="submit"
            className="com-form-btn-primary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Processing..." : "Login"}
          </button>
        </div>
      </form>

      {showOtpModal && (
        <OtpModal otp={generatedOtp} onClose={() => setShowOtpModal(false)} />
      )}
    </div>
  );
};

// Personal Info Form Component
const PersonalInfoForm = ({ userData, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    relationType: "",
    relationName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    pincode: "",
    idType: "",
    idNumber: "",
    occupation: "",
    education: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.relationType) {
      newErrors.relationType = "Relation type is required";
    }

    if (!formData.relationName.trim()) {
      newErrors.relationName = "Relation name is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "PIN code is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "PIN code should be 6 digits";
    }

    if (!formData.idType) {
      newErrors.idType = "ID type is required";
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "ID number is required";
    }

    if (!formData.consent) {
      newErrors.consent = "You must consent to the processing of your data";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="com-form-form-step">
      <div className="com-form-form-progress">
        {[1, 2, 3, 4, 5, 6].map((stepNum) => (
          <div
            key={stepNum}
            className={`com-form-progress-step ${stepNum === 1 ? "active" : ""
              } ${stepNum < 1 ? "completed" : ""}`}
          >
            <div className="com-form-step-number">{stepNum}</div>
            <div className="com-form-step-label">
              {stepNum === 1 && "Personal Info"}
              {stepNum === 2 && "Complaint Details"}
              {stepNum === 3 && "Suspect Info"}
              {stepNum === 4 && "Identity Verification"}
              {stepNum === 5 && "Preview"}
              {stepNum === 6 && "Submission"}
            </div>
          </div>
        ))}
      </div>

      <div className="com-form-step-header">
        <FaUserShield className="com-form-step-icon" />
        <h2>Personal Information</h2>
      </div>
      <p className="com-form-step-description">
        Please provide your personal details for identification and verification.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="com-form-form-grid">
          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="fullName">
              Full Name <span className="com-form-required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name as per official records"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "error" : ""}
            />
            {errors.fullName && (
              <span className="com-form-error-message">{errors.fullName}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="relationType">
              Relation Type <span className="com-form-required">*</span>
            </label>
            <select
              id="relationType"
              name="relationType"
              value={formData.relationType}
              onChange={handleChange}
              className={errors.relationType ? "error" : ""}
            >
              <option value="">Select Relation</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="spouse">Spouse</option>
              <option value="guardian">Guardian</option>
            </select>
            {errors.relationType && (
              <span className="com-form-error-message">{errors.relationType}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="relationName">
              Relation Name <span className="com-form-required">*</span>
            </label>
            <input
              type="text"
              id="relationName"
              name="relationName"
              placeholder="Enter name of relation"
              value={formData.relationName}
              onChange={handleChange}
              className={errors.relationName ? "error" : ""}
            />
            {errors.relationName && (
              <span className="com-form-error-message">{errors.relationName}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="gender">
              Gender <span className="com-form-required">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? "error" : ""}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <span className="com-form-error-message">{errors.gender}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="dateOfBirth">
              Date of Birth <span className="com-form-required">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              max={new Date().toISOString().split("T")[0]}
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={errors.dateOfBirth ? "error" : ""}
            />
            {errors.dateOfBirth && (
              <span className="com-form-error-message">{errors.dateOfBirth}</span>
            )}
          </div>

          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="address">
              Address <span className="com-form-required">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Enter your complete residential address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? "error" : ""}
            />
            {errors.address && (
              <span className="com-form-error-message">{errors.address}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="city">
              City <span className="com-form-required">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? "error" : ""}
            />
            {errors.city && (
              <span className="com-form-error-message">{errors.city}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="pincode">
              PIN Code <span className="com-form-required">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              placeholder="Enter 6-digit PIN code"
              value={formData.pincode}
              onChange={handleChange}
              className={errors.pincode ? "error" : ""}
            />
            {errors.pincode && (
              <span className="com-form-error-message">{errors.pincode}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="idType">
              ID Type <span className="com-form-required">*</span>
            </label>
            <select
              id="idType"
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              className={errors.idType ? "error" : ""}
            >
              <option value="">Select ID Type</option>
              <option value="aadhaar">Aadhaar Card</option>
              <option value="pan">PAN Card</option>
              <option value="passport">Passport</option>
              <option value="voter">Voter ID Card</option>
              <option value="driving">Driving License</option>
            </select>
            {errors.idType && (
              <span className="com-form-error-message">{errors.idType}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="idNumber">
              ID Number <span className="com-form-required">*</span>
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              placeholder="Enter your ID number"
              value={formData.idNumber}
              onChange={handleChange}
              className={errors.idNumber ? "error" : ""}
            />
            {errors.idNumber && (
              <span className="com-form-error-message">{errors.idNumber}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label htmlFor="occupation">Occupation</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              placeholder="Enter your occupation"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>

          <div className="com-form-form-group">
            <label htmlFor="education">Education</label>
            <input
              type="text"
              id="education"
              name="education"
              placeholder="Enter your highest education"
              value={formData.education}
              onChange={handleChange}
            />
          </div>

          <div className="com-form-form-group com-form-full-width com-form-checkbox-group">
            <label className="com-form-checkbox-label">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
              />
              <span>
                I consent to the processing of my personal data for the purpose of
                cybercrime reporting. I understand my information may be shared
                with relevant law enforcement agencies.
              </span>
            </label>
            {errors.consent && (
              <span className="com-form-error-message">{errors.consent}</span>
            )}
          </div>
        </div>

        <div className="com-form-warning-box">
          <FaExclamationTriangle />
          <p>
            <span className="com-form-highlight">WARNING:</span> Providing false
            information is punishable under Section 182/211 of the Indian Penal
            Code.
          </p>
        </div>

        <div className="com-form-form-buttons">
          <button
            type="submit"
            className="com-form-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Next: Complaint Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Complaint Details Form Component
const ComplaintDetailsForm = ({ userData, onSubmit, onPrevStep }) => {
  const [formData, setFormData] = useState({
    complaintCategory: "",
    complaintSubCategory: "",
    lostMoney: "no",
    lostAmount: "",
    incidentDate: "",
    incidentTime: {
      hour: "12",
      minute: "00",
      period: "AM",
    },
    delayInReporting: "no",
    incidentLocation: "",
    evidenceFiles: [],
    additionalInfo: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Online and Social Media Related Crime",
    "Online Financial Fraud",
    "Hacking / Damage to computer,computer system etc.",
    "Online Cyber Trafficking",
    "Online Gambling / Betting",
    "Ransomware",
    "Cryptocurrency Crime",
    "Cyber Terrorism",
    "Any Other Cyber Crime",
  ];

  const subCategories = {
    "Online Financial Fraud": [
      "Aadhar Enabled Payment System (AEPS)",
      "Business Email Compromise/Email Takeover",
      "Debit/Credit Card Fraud/Sim Swap Fraud",
      "Demat/Depository Fraud",
      "E-Wallet Related Fraud",
      "Fraud Call/Vishing",
      "Internet Banking Related Fraud",
      "UPI Related Frauds",
    ],
    "Online and Social Media Related Crime": [
      "Cheating by Impersonation",
      "Cyber Bullying / Stalking / Sexting",
      "E-Mail Phishing",
      "Fake/Impersonating Profile",
      "Impersonating Email",
      "Intimidating Email",
      "Online Job Fraud",
      "Online Matrimonial Fraud",
      "Profile Hacking/ Identity Theft",
      "Provocative Speech for unlawful acts",
    ],
    "Hacking / Damage to computer,computer system etc.": [
      "Damage to computer, computer systems etc.",
      "Email Hacking",
      "Tampering with computer source documents",
      "Unauthorised Access/Data Breach",
      "Website Defacement/Hacking",
    ],
    "Online Cyber Trafficking": ["Online Trafficking"],
    "Online Gambling / Betting": ["Online Gambling/Betting"],
    Ransomware: ["Ransomware Attack"],
    "Cryptocurrency Crime": ["Cryptocurrency Fraud"],
    "Cyber Terrorism": ["Cyber Terrorism"],
    "Any Other Cyber Crime": ["Other Cyber Crime"],
  };

  const locations = [
    "Home",
    "Office",
    "Public Place",
    "Educational Institution",
    "Commercial Establishment",
    "Online Platform",
    "Mobile Device",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "complaintCategory") {
      setFormData({
        ...formData,
        complaintCategory: value,
        complaintSubCategory: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      incidentTime: {
        ...formData.incidentTime,
        [name]: value,
      },
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        evidenceFiles: [...formData.evidenceFiles, ...Array.from(e.target.files)],
      });
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...formData.evidenceFiles];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      evidenceFiles: updatedFiles,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.complaintCategory) {
      newErrors.complaintCategory = "Complaint category is required";
    }

    if (!formData.complaintSubCategory) {
      newErrors.complaintSubCategory = "Complaint sub-category is required";
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = "Incident date is required";
    }

    if (!formData.incidentLocation) {
      newErrors.incidentLocation = "Incident location is required";
    }

    if (!formData.additionalInfo.trim()) {
      newErrors.additionalInfo = "Additional information is required";
    } else if (formData.additionalInfo.trim().length < 200) {
      newErrors.additionalInfo =
        "Please provide at least 200 characters of additional information";
    } else if (/[~!#^'`$|{}<>*]/.test(formData.additionalInfo)) {
      newErrors.additionalInfo =
        "Special characters like ~!#^'`$|{}<>* are not allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className="com-form-form-step">
      <div className="com-form-form-progress">
        {[1, 2, 3, 4, 5, 6].map((stepNum) => (
          <div
            key={stepNum}
            className={`com-form-progress-step ${stepNum === 2 ? "active" : ""
              } ${stepNum < 2 ? "completed" : ""}`}
          >
            <div className="com-form-step-number">{stepNum}</div>
            <div className="com-form-step-label">
              {stepNum === 1 && "Personal Info"}
              {stepNum === 2 && "Complaint Details"}
              {stepNum === 3 && "Suspect Info"}
              {stepNum === 4 && "Identity Verification"}
              {stepNum === 5 && "Preview"}
              {stepNum === 6 && "Submission"}
            </div>
          </div>
        ))}
      </div>

      <div className="com-form-step-header">
        <FaExclamationTriangle className="com-form-step-icon" />
        <h2>Complaint / Incident Details</h2>
      </div>
      <p className="com-form-step-description">
        Provide detailed information about the cybercrime incident.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="com-form-form-grid">
          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="complaintCategory">
              Category of complaint <span className="com-form-required">*</span>
            </label>
            <select
              id="complaintCategory"
              name="complaintCategory"
              value={formData.complaintCategory}
              onChange={handleChange}
              className={errors.complaintCategory ? "error" : ""}
            >
              <option value="">--- Select ---</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.complaintCategory && (
              <span className="com-form-error-message">
                {errors.complaintCategory}
              </span>
            )}
          </div>

          {formData.complaintCategory && (
            <div className="com-form-form-group com-form-full-width">
              <label htmlFor="complaintSubCategory">
                Sub-Category of complaint{" "}
                <span className="com-form-required">*</span>
              </label>
              <select
                id="complaintSubCategory"
                name="complaintSubCategory"
                value={formData.complaintSubCategory}
                onChange={handleChange}
                className={errors.complaintSubCategory ? "error" : ""}
              >
                <option value="">--- Select ---</option>
                {subCategories[formData.complaintCategory]?.map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
              {errors.complaintSubCategory && (
                <span className="com-form-error-message">
                  {errors.complaintSubCategory}
                </span>
              )}
            </div>
          )}

          <div className="com-form-form-group">
            <label>
              Have you lost any money?{" "}
              <span className="com-form-required">*</span>
            </label>
            <div className="com-form-radio-group">
              <label className="com-form-radio-label">
                <input
                  type="radio"
                  name="lostMoney"
                  value="yes"
                  checked={formData.lostMoney === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label className="com-form-radio-label">
                <input
                  type="radio"
                  name="lostMoney"
                  value="no"
                  checked={formData.lostMoney === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          {formData.lostMoney === "yes" && (
            <div className="com-form-form-group">
              <label htmlFor="lostAmount">Amount Lost (INR)</label>
              <div className="com-form-money-input">
                <div className="com-form-currency-symbol">₹</div>
                <input
                  type="number"
                  id="lostAmount"
                  name="lostAmount"
                  placeholder="Enter amount"
                  value={formData.lostAmount}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="com-form-form-group">
            <label htmlFor="incidentDate">
              Date of Incident <span className="com-form-required">*</span>
            </label>
            <input
              type="date"
              id="incidentDate"
              name="incidentDate"
              max={new Date().toISOString().split("T")[0]}
              value={formData.incidentDate}
              onChange={handleChange}
              className={errors.incidentDate ? "error" : ""}
            />
            {errors.incidentDate && (
              <span className="com-form-error-message">{errors.incidentDate}</span>
            )}
          </div>

          <div className="com-form-form-group">
            <label>
              Time of Incident <span className="com-form-required">*</span>
            </label>
            <div className="com-form-time-input-container">
              <select
                name="hour"
                value={formData.incidentTime.hour}
                onChange={handleTimeChange}
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span className="com-form-time-separator">:</span>
              <select
                name="minute"
                value={formData.incidentTime.minute}
                onChange={handleTimeChange}
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <select
                name="period"
                value={formData.incidentTime.period}
                onChange={handleTimeChange}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className="com-form-form-group">
            <label>
              Was there a delay in reporting?{" "}
              <span className="com-form-required">*</span>
            </label>
            <div className="com-form-radio-group">
              <label className="com-form-radio-label">
                <input
                  type="radio"
                  name="delayInReporting"
                  value="yes"
                  checked={formData.delayInReporting === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label className="com-form-radio-label">
                <input
                  type="radio"
                  name="delayInReporting"
                  value="no"
                  checked={formData.delayInReporting === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          <div className="com-form-form-group">
            <label htmlFor="incidentLocation">
              Location of Incident <span className="com-form-required">*</span>
            </label>
            <select
              id="incidentLocation"
              name="incidentLocation"
              value={formData.incidentLocation}
              onChange={handleChange}
              className={errors.incidentLocation ? "error" : ""}
            >
              <option value="">--- Select ---</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {errors.incidentLocation && (
              <span className="com-form-error-message">
                {errors.incidentLocation}
              </span>
            )}
          </div>

          <div className="com-form-form-group com-form-full-width">
            <label>Upload Evidence</label>
            <div className="com-form-file-upload-container">
              <div className="com-form-file-upload-input">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <div className="com-form-file-upload-placeholder">
                  <FaCloudUploadAlt />
                  <p>Drag and drop files here or click to upload</p>
                  <span>Supported formats: PDF, JPG, PNG (Max 10MB)</span>
                </div>
              </div>
              {formData.evidenceFiles.length > 0 && (
                <div className="com-form-uploaded-files">
                  <h4>Uploaded Files</h4>
                  <ul>
                    {formData.evidenceFiles.map((file, index) => (
                      <li key={index}>
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="additionalInfo">
              Additional Information <span className="com-form-required">*</span>
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={6}
              placeholder="Describe the incident in detail (minimum 200 characters)"
              value={formData.additionalInfo}
              onChange={handleChange}
              className={errors.additionalInfo ? "error" : ""}
            />
            <div className="com-form-character-count">
              Character count: <span>{formData.additionalInfo.length}</span>
            </div>
            {errors.additionalInfo && (
              <span className="com-form-error-message">
                {errors.additionalInfo}
              </span>
            )}
          </div>
        </div>

        <div className="com-form-note-box">
          <FaInfoCircle />
          <p>
            Please ensure all details are accurate. For urgent cases, contact the{" "}
            <span className="com-form-highlight">Cybercrime Helpline</span> at{" "}
            <span className="com-form-highlight">1930</span>.
          </p>
        </div>

        <div className="com-form-form-buttons">
          <button
            type="button"
            className="com-form-btn-outline"
            onClick={onPrevStep}
          >
            Previous
          </button>
          <button
            type="submit"
            className="com-form-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Next: Suspect Info"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Suspect Info Form Component
const SuspectInfoForm = ({ userData, onSubmit, onPrevStep }) => {
  const [formData, setFormData] = useState({
    suspectKnown: "no",
    suspectName: "",
    suspectContact: "",
    suspectAddress: "",
    suspectDetails: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.suspectDetails.trim()) {
      newErrors.suspectDetails = "Suspect details are required";
    } else if (formData.suspectDetails.trim().length < 100) {
      newErrors.suspectDetails =
        "Please provide at least 100 characters of suspect details";
    }

    if (formData.suspectKnown === "yes") {
      if (!formData.suspectName.trim()) {
        newErrors.suspectName = "Suspect name is required";
      }

      if (
        formData.suspectContact &&
        !/^[0-9]{10}$/.test(formData.suspectContact)
      ) {
        newErrors.suspectContact = "Suspect contact should be 10 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="com-form-form-step">
      <div className="com-form-form-progress">
        {[1, 2, 3, 4, 5, 6].map((stepNum) => (
          <div
            key={stepNum}
            className={`com-form-progress-step ${stepNum === 3 ? "active" : ""
              } ${stepNum < 3 ? "completed" : ""}`}
          >
            <div className="com-form-step-number">{stepNum}</div>
            <div className="com-form-step-label">
              {stepNum === 1 && "Personal Info"}
              {stepNum === 2 && "Complaint Details"}
              {stepNum === 3 && "Suspect Info"}
              {stepNum === 4 && "Identity Verification"}
              {stepNum === 5 && "Preview"}
              {stepNum === 6 && "Submission"}
            </div>
          </div>
        ))}
      </div>

      <div className="com-form-step-header">
        <FaUserShield className="com-form-step-icon" />
        <h2>Suspect Information</h2>
      </div>
      <p className="com-form-step-description">
        Provide any known details about the suspect involved in the incident.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="com-form-form-grid">
          <div className="com-form-form-group com-form-full-width">
            <label>
              Is the suspect known? <span className="com-form-required">*</span>
            </label>
            <div className="com-form-radio-group">
              <label className="com-form-radio-label">
                <input
                  type="radio"
                  name="suspectKnown"
                  value="yes"
                  checked={formData.suspectKnown === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label className="com-form-radio-label">
                <input
                  type="radio"
                  name="suspectKnown"
                  value="no"
                  checked={formData.suspectKnown === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          {formData.suspectKnown === "yes" && (
            <>
              <div className="com-form-form-group">
                <label htmlFor="suspectName">
                  Suspect Name <span className="com-form-required">*</span>
                </label>
                <input
                  type="text"
                  id="suspectName"
                  name="suspectName"
                  placeholder="Enter suspect's name"
                  value={formData.suspectName}
                  onChange={handleChange}
                  className={errors.suspectName ? "error" : ""}
                />
                {errors.suspectName && (
                  <span className="com-form-error-message">
                    {errors.suspectName}
                  </span>
                )}
              </div>

              <div className="com-form-form-group">
                <label htmlFor="suspectContact">Suspect Contact Number</label>
                <div className="com-form-mobile-input-container">
                  <div className="com-form-country-code">+91</div>
                  <input
                    type="text"
                    id="suspectContact"
                    name="suspectContact"
                    placeholder="Suspect's mobile number"
                    value={formData.suspectContact}
                    onChange={handleChange}
                    className={errors.suspectContact ? "error" : ""}
                  />
                </div>
                {errors.suspectContact && (
                  <span className="com-form-error-message">
                    {errors.suspectContact}
                  </span>
                )}
              </div>

              <div className="com-form-form-group com-form-full-width">
                <label htmlFor="suspectAddress">Suspect Address</label>
                <textarea
                  id="suspectAddress"
                  name="suspectAddress"
                  rows={3}
                  placeholder="Enter suspect's address (if known)"
                  value={formData.suspectAddress}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="suspectDetails">
              Suspect Details <span className="com-form-required">*</span>
            </label>
            <textarea
              id="suspectDetails"
              name="suspectDetails"
              rows={6}
              placeholder="Provide any known details about the suspect (minimum 100 characters)"
              value={formData.suspectDetails}
              onChange={handleChange}
              className={errors.suspectDetails ? "error" : ""}
            />
            <div className="com-form-character-count">
              Character count: <span>{formData.suspectDetails.length}</span>
            </div>
            {errors.suspectDetails && (
              <span className="com-form-error-message">
                {errors.suspectDetails}
              </span>
            )}
          </div>
        </div>

        <div className="com-form-note-box">
          <FaInfoCircle />
          <p>
            If you do not know the suspect, provide any relevant details such as
            online handles, email addresses, or other identifiers.
          </p>
        </div>

        <div className="com-form-form-buttons">
          <button
            type="button"
            className="com-form-btn-outline"
            onClick={onPrevStep}
          >
            Previous
          </button>
          <button
            type="submit"
            className="com-form-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Next: Identity Verification"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Identity Verification Form Component
const IdentityVerificationForm = ({ userData, onSubmit, onPrevStep }) => {
  const [formData, setFormData] = useState({
    idDocument: null,
    selfie: null,
    declaration: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const { name } = e.target;
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });

      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  const handleRemoveFile = (name) => {
    setFormData({
      ...formData,
      [name]: null,
    });
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idDocument) {
      newErrors.idDocument = "ID document is required";
    }

    if (!formData.selfie) {
      newErrors.selfie = "Selfie is required";
    }

    if (!formData.declaration) {
      newErrors.declaration = "You must agree to the declaration";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="com-form-form-step">
      <div className="com-form-form-progress">
        {[1, 2, 3, 4, 5, 6].map((stepNum) => (
          <div
            key={stepNum}
            className={`com-form-progress-step ${stepNum === 4 ? "active" : ""
              } ${stepNum < 4 ? "completed" : ""}`}
          >
            <div className="com-form-step-number">{stepNum}</div>
            <div className="com-form-step-label">
              {stepNum === 1 && "Personal Info"}
              {stepNum === 2 && "Complaint Details"}
              {stepNum === 3 && "Suspect Info"}
              {stepNum === 4 && "Identity Verification"}
              {stepNum === 5 && "Preview"}
              {stepNum === 6 && "Submission"}
            </div>
          </div>
        ))}
      </div>

      <div className="com-form-step-header">
        <FaShieldAlt className="com-form-step-icon" />
        <h2>Identity Verification</h2>
      </div>
      <p className="com-form-step-description">
        Upload documents to verify your identity for secure complaint submission.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="com-form-form-grid">
          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="idDocument">
              Upload ID Document <span className="com-form-required">*</span>
            </label>
            <div className="com-form-file-upload-container">
              <div className="com-form-file-upload-input">
                <input
                  type="file"
                  id="idDocument"
                  name="idDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <div className="com-form-file-upload-placeholder">
                  <FaCloudUploadAlt />
                  <p>Upload your ID document</p>
                  <span>Supported formats: PDF, JPG, PNG (Max 10MB)</span>
                </div>
              </div>
              {formData.idDocument && (
                <div className="com-form-uploaded-files">
                  <h4>Uploaded File</h4>
                  <ul>
                    <li>
                      <span>{formData.idDocument.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("idDocument")}
                      >
                        ×
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {errors.idDocument && (
              <span className="com-form-error-message">{errors.idDocument}</span>
            )}
            <p className="com-form-help-text">
              Upload a clear copy of your Aadhaar, PAN, Passport, Voter ID, or
              Driving License.
            </p>
          </div>

          <div className="com-form-form-group com-form-full-width">
            <label htmlFor="selfie">
              Upload Selfie <span className="com-form-required">*</span>
            </label>
            <div className="com-form-file-upload-container">
              <div className="com-form-file-upload-input">
                <input
                  type="file"
                  id="selfie"
                  name="selfie"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <div className="com-form-file-upload-placeholder">
                  <FaCloudUploadAlt />
                  <p>Upload a recent selfie</p>
                  <span>Supported formats: JPG, PNG (Max 10MB)</span>
                </div>
              </div>
              {formData.selfie && (
                <div className="com-form-uploaded-files">
                  <h4>Uploaded File</h4>
                  <ul>
                    <li>
                      <span>{formData.selfie.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("selfie")}
                      >
                        ×
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {errors.selfie && (
              <span className="com-form-error-message">{errors.selfie}</span>
            )}
            <p className="com-form-help-text">
              Ensure your face is clearly visible and well-lit.
            </p>
          </div>

          <div className="com-form-form-group com-form-full-width com-form-checkbox-group">
            <label className="com-form-checkbox-label">
              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={handleChange}
              />
              <span>
                I declare that the uploaded documents are genuine and belong to me.
                I understand that providing false documents is a punishable
                offense.
              </span>
            </label>
            {errors.declaration && (
              <span className="com-form-error-message">{errors.declaration}</span>
            )}
          </div>
        </div>

        <div className="com-form-warning-box">
          <FaExclamationTriangle />
          <p>
            <span className="com-form-highlight">WARNING:</span> Submitting
            fraudulent documents may lead to legal action under applicable laws.
          </p>
        </div>

        <div className="com-form-form-buttons">
          <button
            type="button"
            className="com-form-btn-outline"
            onClick={onPrevStep}
          >
            Previous
          </button>
          <button
            type="submit"
            className="com-form-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Next: Preview"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Preview Form Component
const PreviewForm = ({
  userData,
  complaintData,
  suspectData,
  identityData,
  onSubmit,
  onPrevStep,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="com-form-form-step">
      <div className="com-form-form-progress">
        {[1, 2, 3, 4, 5, 6].map((stepNum) => (
          <div
            key={stepNum}
            className={`com-form-progress-step ${stepNum === 5 ? "active" : ""
              } ${stepNum < 5 ? "completed" : ""}`}
          >
            <div className="com-form-step-number">{stepNum}</div>
            <div className="com-form-step-label">
              {stepNum === 1 && "Personal Info"}
              {stepNum === 2 && "Complaint Details"}
              {stepNum === 3 && "Suspect Info"}
              {stepNum === 4 && "Identity Verification"}
              {stepNum === 5 && "Preview"}
              {stepNum === 6 && "Submission"}
            </div>
          </div>
        ))}
      </div>

      <div className="com-form-step-header">
        <FaShieldAlt className="com-form-step-icon" />
        <h2>Preview Your Complaint</h2>
      </div>
      <p className="com-form-step-description">
        Review all the details before submitting your complaint.
      </p>

      <div className="com-form-preview-section">
        <h3>Personal Information</h3>
        <div className="com-form-preview-grid">
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Login ID</div>
            <div className="com-form-preview-value">
              {userData?.loginId ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Mobile Number</div>
            <div className="com-form-preview-value">
              {userData?.mobileNo ? `+91 ${userData.mobileNo}` : "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Full Name</div>
            <div className="com-form-preview-value">
              {userData?.fullName ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Relation</div>
            <div className="com-form-preview-value">
              {userData?.relationType && userData?.relationName
                ? `${userData.relationType} - ${userData.relationName}`
                : "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Gender</div>
            <div className="com-form-preview-value">
              {userData?.gender ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Date of Birth</div>
            <div className="com-form-preview-value">
              {userData?.dateOfBirth ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item com-form-full-width">
            <div className="com-form-preview-label">Address</div>
            <div className="com-form-preview-value">
              {userData?.address ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">City</div>
            <div className="com-form-preview-value">
              {userData?.city ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">PIN Code</div>
            <div className="com-form-preview-value">
              {userData?.pincode ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">ID Type</div>
            <div className="com-form-preview-value">
              {userData?.idType ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">ID Number</div>
            <div className="com-form-preview-value">
              {userData?.idNumber ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Occupation</div>
            <div className="com-form-preview-value">
              {userData?.occupation ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Education</div>
            <div className="com-form-preview-value">
              {userData?.education ?? "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="com-form-preview-section">
        <h3>Complaint Details</h3>
        <div className="com-form-preview-grid">
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Category</div>
            <div className="com-form-preview-value">
              {complaintData?.complaintCategory ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Sub-Category</div>
            <div className="com-form-preview-value">
              {complaintData?.complaintSubCategory ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Money Lost</div>
            <div className="com-form-preview-value">
              {complaintData?.lostMoney === "yes"
                ? `Yes (₹${complaintData.lostAmount ?? "0"})`
                : "No"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Incident Date</div>
            <div className="com-form-preview-value">
              {complaintData?.incidentDate ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Incident Time</div>
            <div className="com-form-preview-value">
              {complaintData?.incidentTime
                ? `${complaintData.incidentTime.hour}:${complaintData.incidentTime.minute} ${complaintData.incidentTime.period}`
                : "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Delay in Reporting</div>
            <div className="com-form-preview-value">
              {complaintData?.delayInReporting ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Location</div>
            <div className="com-form-preview-value">
              {complaintData?.incidentLocation ?? "N/A"}
            </div>
          </div>
          <div className="com-form-preview-item com-form-full-width">
            <div className="com-form-preview-label">Evidence Files</div>
            <div className="com-form-preview-value">
              {complaintData?.evidenceFiles?.length > 0
                ? complaintData.evidenceFiles.map((file) => file.name).join(", ")
                : "None"}
            </div>
          </div>
          <div className="com-form-preview-item com-form-full-width">
            <div className="com-form-preview-label">Additional Information</div>
            <div className="com-form-preview-value com-form-preview-text">
              {complaintData?.additionalInfo ?? "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="com-form-preview-section">
        <h3>Suspect Information</h3>
        <div className="com-form-preview-grid">
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Suspect Known</div>
            <div className="com-form-preview-value">
              {suspectData?.suspectKnown ?? "N/A"}
            </div>
          </div>
          {suspectData?.suspectKnown === "yes" && (
            <>
              <div className="com-form-preview-item">
                <div className="com-form-preview-label">Suspect Name</div>
                <div className="com-form-preview-value">
                  {suspectData?.suspectName ?? "N/A"}
                </div>
              </div>
              <div className="com-form-preview-item">
                <div className="com-form-preview-label">Suspect Contact</div>
                <div className="com-form-preview-value">
                  {suspectData?.suspectContact ?? "N/A"}
                </div>
              </div>
              <div className="com-form-preview-item com-form-full-width">
                <div className="com-form-preview-label">Suspect Address</div>
                <div className="com-form-preview-value">
                  {suspectData?.suspectAddress ?? "N/A"}
                </div>
              </div>
            </>
          )}
          <div className="com-form-preview-item com-form-full-width">
            <div className="com-form-preview-label">Suspect Details</div>
            <div className="com-form-preview-value com-form-preview-text">
              {suspectData?.suspectDetails ?? "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="com-form-preview-section">
        <h3>Identity Verification</h3>
        <div className="com-form-preview-grid">
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">ID Document</div>
            <div className="com-form-preview-value">
              {identityData?.idDocument?.name ?? "None"}
            </div>
          </div>
          <div className="com-form-preview-item">
            <div className="com-form-preview-label">Selfie</div>
            <div className="com-form-preview-value">
              {identityData?.selfie?.name ?? "None"}
            </div>
          </div>
        </div>
      </div>

      <div className="com-form-form-buttons">
        <button
          type="button"
          className="com-form-btn-outline"
          onClick={onPrevStep}
        >
          Previous
        </button>
        <button
          type="button"
          className="com-form-btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>
    </div>
  );
};

// Success Message Component
const SuccessMessage = ({ complaintId }) => {
  return (
    <div className="com-form-success-message">
      <div className="com-form-form-progress">
        {[1, 2, 3, 4, 5, 6].map((stepNum) => (
          <div
            key={stepNum}
            className={`com-form-progress-step ${stepNum === 6 ? "active" : "completed"
              }`}
          >
            <div className="com-form-step-number">{stepNum}</div>
            <div className="com-form-step-label">
              {stepNum === 1 && "Personal Info"}
              {stepNum === 2 && "Complaint Details"}
              {stepNum === 3 && "Suspect Info"}
              {stepNum === 4 && "Identity Verification"}
              {stepNum === 5 && "Preview"}
              {stepNum === 6 && "Submission"}
            </div>
          </div>
        ))}
      </div>

      <FaCheck className="com-form-success-icon" />
      <h2>Complaint Submitted Successfully!</h2>
      <p>
        Your cybercrime complaint has been successfully submitted to the National
        Cybercrime Reporting Portal.
      </p>
      <div className="com-form-complaint-id-box">
        <div className="com-form-complaint-id-label">Complaint ID</div>
        <div className="com-form-complaint-id">{complaintId}</div>
      </div>
      <p className="com-form-success-note">
        Please save this Complaint ID for future reference. You can track the
        status of your complaint using this ID on the portal.
      </p>
      <h3>Next Steps</h3>
      <ul className="com-form-next-steps">
        <li>You will receive a confirmation email/SMS with details.</li>
        <li>
          The complaint will be reviewed by the Cybercrime Investigation Team.
        </li>
        <li>You may be contacted for additional information or clarification.</li>
        <li>Track your complaint status using the Complaint ID on the portal.</li>
      </ul>
    </div>
  );
};

// Main Complaint Form Component
const ComplaintForm = () => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [complaintData, setComplaintData] = useState({});
  const [suspectData, setSuspectData] = useState({});
  const [identityData, setIdentityData] = useState({});
  const [complaintId] = useState(
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setStep(1);
  };

  const handlePersonalInfoSubmit = (data) => {
    setUserData({ ...userData, ...data });
    setStep(2);
  };

  const handleComplaintDetailsSubmit = (data) => {
    setComplaintData(data);
    setStep(3);
  };

  const handleSuspectInfoSubmit = (data) => {
    setSuspectData(data);
    setStep(4);
  };

  const handleIdentityVerificationSubmit = (data) => {
    setIdentityData(data);
    setStep(5);
  };

  const handlePreviewSubmit = () => {
    setStep(6);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="com-form-container">
      <header className="com-form-page-header">
        <h1 className="page-title">
          <Terminal size={28} className="com-header-icon" />
          <span>National Cybercrime Reporting (Test Portal)</span>
        </h1>
        <div className="com-form-header-details">
          <p>
            Report cybercrime securely with our{" "}
            <span className="com-form-blink">encrypted</span> system
          </p>
        </div>
      </header>

      <div className="com-form-cyber-complaint-container">
        <div className="com-form-cyber-panel com-form-complaint-panel">
          {step === 0 && <LoginForm onLoginSuccess={handleLoginSuccess} />}
          {step === 1 && (
            <PersonalInfoForm
              userData={userData}
              onSubmit={handlePersonalInfoSubmit}
            />
          )}
          {step === 2 && (
            <ComplaintDetailsForm
              userData={userData}
              onSubmit={handleComplaintDetailsSubmit}
              onPrevStep={handlePrevStep}
            />
          )}
          {step === 3 && (
            <SuspectInfoForm
              userData={userData}
              onSubmit={handleSuspectInfoSubmit}
              onPrevStep={handlePrevStep}
            />
          )}
          {step === 4 && (
            <IdentityVerificationForm
              userData={userData}
              onSubmit={handleIdentityVerificationSubmit}
              onPrevStep={handlePrevStep}
            />
          )}
          {step === 5 && (
            <PreviewForm
              userData={userData}
              complaintData={complaintData}
              suspectData={suspectData}
              identityData={identityData}
              onSubmit={handlePreviewSubmit}
              onPrevStep={handlePrevStep}
            />
          )}
          {step === 6 && <SuccessMessage complaintId={complaintId} />}
        </div>
      </div>

      <div className="com-form-emergency-contact-section">
        <h3>Emergency Contacts</h3>
        <div className="com-form-emergency-grid">
          <div
            className="com-form-emergency-card"
            aria-label="Cybercrime Helpline Contact"
          >
            <div className="com-form-portal-logo">
              <Phone className="com-form-logo-icon" />
            </div>
            <h4>Cybercrime Helpline</h4>
            <p>Call: 1930</p>
            <p>Available 24/7 for urgent cybercrime reporting</p>
          </div>
          <div
            className="com-form-emergency-card"
            aria-label="National Police Helpline Contact"
          >
            <div className="com-form-portal-logo">
              <Phone className="com-form-logo-icon" />
            </div>
            <h4>National Police Helpline</h4>
            <p>Call: 112</p>
            <p>Available 24/7 for emergency assistance</p>
          </div>
          <div
            className="com-form-emergency-card"
            aria-label="Women Helpline Contact"
          >
            <div className="com-form-portal-logo">
              <Phone className="com-form-logo-icon" />
            </div>
            <h4>Women Helpline</h4>
            <p>Call: 181</p>
            <p>Support for women facing cybercrime or harassment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;