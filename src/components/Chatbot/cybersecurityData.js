const getLevenshteinDistance = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b.charAt(i - 1) === a.charAt(j - 1)
          ? matrix[i - 1][j - 1]
          : Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
    }
  }
  return matrix[b.length][a.length];
};

const getWordOverlapScore = (tokens, keywords) => {
  let score = 0;
  for (const token of tokens) {
    for (const keyword of keywords) {
      if (token === keyword) score += 2;
      else if (getLevenshteinDistance(token, keyword) <= 3) score += 1;
    }
  }
  return score / Math.max(keywords.length, 1);
};

const isGreeting = (input) => {
  const greetings = [
    "hi",
    "hello",
    "hey",
    "greetings",
    "yo",
    "hii",
    "hiii",
    "sup",
    "helo",
    "hallo",
  ];
  return greetings.some((greeting) => input.includes(greeting));
};

const normalizeInput = (input) => {
  let normalized = input.toLowerCase().trim();
  const replacements = {
    ac: "act",
    "it act": "it act",
    "indian it act": "it act",
    indain: "indian",
    sction: "section",
    secton: "section",
    sction66a: "section 66a",
    secton66a: "section 66a",
    phising: "phishing",
    ransomeware: "ransomware",
    ddos: "ddos",
    hack: "hacking",
    secure: "security",
    lawz: "law",
    cybercrimez: "cybercrime",
    virus: "malware",
    breach: "data breach",
    sction66: "section 66",
    secton66: "section 66",
    skiming: "skimming",
    worms: "worm",
    dpda: "DPDP Act",
    dpdp: "DPDP Act",
    dpdpa: "DPDP Act",
  };
  for (const [key, value] of Object.entries(replacements)) {
    normalized = normalized.replace(new RegExp(`\\b${key}\\b`, "gi"), value);
  }
  normalized = normalized.replace(/[\W_]+/g, " ");
  normalized = normalized.replace(/\s+/g, " ");
  return normalized;
};

const tokenize = (input) => {
  return input.split(/\s+/).filter((word) => word.length > 1);
};

const removeStopwords = (tokens) => {
  const stopwords = [
    "what",
    "is",
    "of",
    "the",
    "a",
    "an",
    "in",
    "to",
    "for",
    "on",
    "with",
    "about",
    "how",
    "and",
    "are",
    "can",
    "do",
    "tell",
    "me",
    "please",
    "i",
    "you",
    "it",
    "at",
    "by",
    "from",
  ];
  return tokens.filter((token) => !stopwords.includes(token));
};

const detectIntent = (input) => {
  const intents = {
    definition: ["what is", "define", "explain", "tell me about"],
    action: ["how to", "steps to", "prevent", "protect", "safety", "myself"],
    report: [
      "report",
      "where to report",
      "how to report",
      "cybercrime",
      "complaint",
    ],
  };
  const detectedIntents = [];
  for (const [intent, phrases] of Object.entries(intents)) {
    if (phrases.some((phrase) => input.includes(phrase))) {
      detectedIntents.push(intent);
    }
  }
  return detectedIntents.length > 0 ? detectedIntents : ["general"];
};

const getClosestMatch = (tokens, keywords) => {
  let bestMatch = "";
  let bestScore = -1;
  for (const keyword of keywords) {
    const keywordWords = keyword.split(/\s+/);
    const score = getWordOverlapScore(tokens, keywordWords);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = keyword;
    }
  }
  return bestScore > 0.3 ? `Did you mean "${bestMatch}"?` : "";
};

export const generateRuleBasedResponse = (input) => {
  const lowerInput = normalizeInput(input);
  const tokens = removeStopwords(tokenize(lowerInput));
  const intents = detectIntent(lowerInput);
  const TYPO_THRESHOLD = 3;
  const MAX_SCORE = 30;
  const CONFIDENCE_THRESHOLD = 0.3;

  class ScoredMatch {
    constructor(type, item, score) {
      this.type = type;
      this.item = item;
      this.score = score;
      this.confidence = Math.min(score / MAX_SCORE, 1);
    }
  }

  const matches = [];

  // Handle greetings
  if (isGreeting(lowerInput)) {
    return "Hello! I'm ZeroBot, your cybersecurity assistant. I can help you with:\n\n- Cyber threats: Learn about phishing, ransomware, malware, etc.\n- Indian cyber laws: IT Act sections and penalties\n- Protection tips: Best practices to stay safe online\n- Reporting cybercrimes: How and where to report incidents\n\nWhat would you like to know about?";
  }

  // Handle identity questions
  if (lowerInput.includes("who are you") || lowerInput.includes("what are you") || lowerInput.includes("your name")) {
    return "I'm ZeroBot, a cybersecurity assistant developed for ZeroTrace. I specialize in:\n\n- Indian cyber laws and IT Act provisions\n- Cyber threats and attack types\n- Protection and prevention measures\n- Cybercrime reporting procedures\n\nI use rule-based intelligence to provide accurate information about cybersecurity topics. How can I assist you today?";
  }

  // Handle capability questions
  if (lowerInput.includes("what can you do") || lowerInput.includes("help me") || lowerInput.includes("how can you help") || lowerInput.includes("your features")) {
    return "I can help you with:\n\nINDIAN CYBER LAWS\n- IT Act sections (66, 66A, 66C, 66F, etc.)\n- Penalties and provisions\n- DPDP Act 2023\n\nCYBER THREATS\n- Phishing, Ransomware, Malware\n- DDoS, SQL Injection, Social Engineering\n- Protection measures for each\n\nSECURITY BEST PRACTICES\n- Password security, MFA\n- Network and endpoint security\n- Data protection\n\nREPORTING\n- cybercrime.gov.in\n- 1930 Helpline\n- Local cyber cells\n\nJust ask me about any of these topics!";
  }

  // Handle thank you
  if (lowerInput.includes("thank") || lowerInput.includes("thanks")) {
    return "You're welcome! Stay safe online. If you have more questions about cybersecurity, feel free to ask anytime.";
  }

  // Handle goodbye
  if (lowerInput.includes("bye") || lowerInput.includes("goodbye") || lowerInput.includes("see you")) {
    return "Goodbye! Remember to stay vigilant online. Visit cybercrime.gov.in if you ever need to report a cybercrime. Take care!";
  }

  // Handle helpline questions
  if (lowerInput.includes("helpline") || lowerInput.includes("1930") || lowerInput.includes("emergency number") || lowerInput.includes("contact number")) {
    return "EMERGENCY CYBERCRIME HELPLINES\n\n- 1930: National Cyber Crime Helpline (24/7)\n- cybercrime.gov.in: Online reporting portal\n- 112: Emergency services\n- CERT-In: cert-in.org.in for technical incidents\n\nLocal Cyber Cells:\n- Delhi: delhipolice.gov.in\n- Mumbai: mumbaipolice.gov.in\n- Bangalore: bcp.karnataka.gov.in\n\nFor financial fraud, also contact your bank immediately!";
  }

  // FAQ-based direct matching for common questions
  const faqPatterns = [
    {
      patterns: ["password", "strong password", "password security", "password tips", "secure password"],
      response: "PASSWORD SECURITY BEST PRACTICES\n\nCreating Strong Passwords:\n- Use at least 12-16 characters\n- Mix uppercase, lowercase, numbers, and symbols\n- Avoid personal info (birthdays, names)\n- Don't use dictionary words\n\nManaging Passwords:\n- Use a password manager (Bitwarden, LastPass)\n- Never reuse passwords across sites\n- Enable 2FA/MFA everywhere possible\n- Change passwords if you suspect a breach\n\nRed Flags:\n- Password reset emails you didn't request\n- Login alerts from unknown locations\n- Unable to access your account"
    },
    {
      patterns: ["phishing", "phishing attack", "phishing email", "fake email", "suspicious email"],
      response: "PHISHING ATTACKS\n\nWhat is Phishing?\nDeceptive attempts to steal sensitive info by posing as trusted entities.\n\nWarning Signs:\n- Urgent language ('Account suspended!')\n- Spelling/grammar errors\n- Suspicious sender addresses\n- Links to unfamiliar websites\n- Requests for personal information\n\nProtection:\n- Verify sender email addresses\n- Hover over links before clicking\n- Never share passwords via email\n- Contact companies directly if unsure\n- Use email filters\n\nIf You Clicked:\n1. Disconnect from internet\n2. Change passwords immediately\n3. Run antivirus scan\n4. Report to cybercrime.gov.in"
    },
    {
      patterns: ["ransomware", "files encrypted", "ransom attack", "locked files", "decrypt files"],
      response: "RANSOMWARE\n\nWhat is Ransomware?\nMalware that encrypts your files and demands payment for the decryption key.\n\nPrevention:\n- Keep regular offline backups\n- Update all software promptly\n- Don't open suspicious attachments\n- Use reputable antivirus software\n- Train employees on security\n\nIf Infected:\n1. Disconnect from network immediately\n2. Do NOT pay the ransom\n3. Report to cybercrime.gov.in (1930)\n4. Restore from clean backups\n5. Check nomoreransom.org for decryption tools\n\nCommon Types: WannaCry, Ryuk, LockBit, REvil"
    },
    {
      patterns: ["hack", "hacking", "hacked", "someone hacked", "been hacked", "protect from hackers"],
      response: "HACKING PROTECTION\n\nSigns You've Been Hacked:\n- Unexpected account activity\n- Password not working\n- Strange emails sent from your account\n- New programs you didn't install\n- Slow device performance\n\nImmediate Steps if Hacked:\n1. Change all passwords from a secure device\n2. Enable 2FA on all accounts\n3. Check for unauthorized transactions\n4. Run full antivirus scan\n5. Report to cybercrime.gov.in or call 1930\n\nPrevention:\n- Use strong, unique passwords\n- Enable MFA everywhere\n- Keep software updated\n- Be cautious with public WiFi\n- Don't click suspicious links"
    },
    {
      patterns: ["vpn", "virtual private network", "need vpn", "vpn safe"],
      response: "VPN (VIRTUAL PRIVATE NETWORK)\n\nWhat is a VPN?\nEncrypts your internet connection and hides your IP address for privacy.\n\nWhen to Use:\n- On public WiFi\n- Accessing sensitive data\n- When privacy is important\n- In countries with internet restrictions\n\nChoosing a VPN:\n- Avoid free VPNs (may sell your data)\n- Look for no-log policies\n- Check encryption standards\n- Consider speed and server locations\n\nPopular Options: ProtonVPN, NordVPN, ExpressVPN, Mullvad"
    },
    {
      patterns: ["malware", "virus", "trojan", "spyware", "infected computer", "remove virus"],
      response: "MALWARE PROTECTION\n\nTypes of Malware:\n- Virus: Spreads by attaching to files\n- Trojan: Disguised as legitimate software\n- Spyware: Steals your information secretly\n- Worms: Self-replicating across networks\n- Keyloggers: Records your keystrokes\n\nSigns of Infection:\n- Slow performance\n- Pop-ups and unexpected ads\n- Programs crashing\n- High network activity\n\nRemoval Steps:\n1. Boot in Safe Mode\n2. Run full antivirus scan\n3. Delete malicious files\n4. Reset passwords\n5. Update all software"
    },
    {
      patterns: ["2fa", "mfa", "two factor", "multi factor", "authentication", "2 factor"],
      response: "TWO-FACTOR AUTHENTICATION (2FA/MFA)\n\nWhat is it?\nAn extra layer of security requiring two forms of verification.\n\nTypes:\n- SMS codes (least secure)\n- Authenticator apps (Google, Microsoft, Authy)\n- Hardware keys (YubiKey)\n- Biometrics (fingerprint, face)\n\nWhere to Enable:\n- Email accounts\n- Banking apps\n- Social media\n- Cloud storage\n- Work applications\n\nRecommendation: Use authenticator apps over SMS for better security."
    },
    {
      patterns: ["social engineering", "manipulation", "tricked", "scammed"],
      response: "SOCIAL ENGINEERING\n\nWhat is it?\nPsychological manipulation to trick people into revealing information.\n\nCommon Tactics:\n- Pretexting: Fake scenarios to gain trust\n- Baiting: Offering something enticing\n- Tailgating: Following into secure areas\n- Quid Pro Quo: Offering help for info\n\nRed Flags:\n- Urgency and pressure\n- Requests for sensitive info\n- Too-good-to-be-true offers\n- Unusual requests from 'authorities'\n\nProtection:\n- Verify identities before sharing info\n- Be skeptical of unsolicited contacts\n- Follow security policies\n- Report suspicious requests"
    },
    {
      patterns: ["data breach", "data leak", "information stolen", "breach notification"],
      response: "DATA BREACHES\n\nWhat to Do After a Breach:\n1. Find out what data was exposed\n2. Change affected passwords immediately\n3. Enable 2FA on all accounts\n4. Monitor bank statements closely\n5. Watch for phishing attempts\n6. Consider credit monitoring\n\nCheck if You're Affected:\n- haveibeenpwned.com\n- Breach notification from the company\n\nYour Rights (DPDP Act 2023):\n- Companies must notify you of breaches\n- You can request data deletion\n- Fines up to Rs.250 crore for violations"
    },
    {
      patterns: ["online fraud", "cyber fraud", "money stolen", "bank fraud", "upi fraud", "payment fraud"],
      response: "ONLINE FINANCIAL FRAUD\n\nCommon Types:\n- UPI fraud\n- Phishing for banking details\n- Fake investment schemes\n- OTP theft\n- Card skimming\n\nImmediate Steps if Frauded:\n1. Call 1930 IMMEDIATELY\n2. Contact your bank to freeze account\n3. File report at cybercrime.gov.in\n4. Preserve all evidence (screenshots, messages)\n5. File FIR at local police station\n\nPrevention:\n- Never share OTP with anyone\n- Don't click unknown payment links\n- Verify QR codes before scanning\n- Use official banking apps only"
    },
    {
      patterns: ["it act", "cyber law", "indian law", "cyber crime law", "information technology act"],
      response: "INDIAN CYBER LAWS (IT ACT 2000)\n\nKey Sections:\n- Section 43: Unauthorized access (Up to Rs.1 crore compensation)\n- Section 66: Hacking (3 years + Rs.5 lakh fine)\n- Section 66C: Identity theft (3 years + Rs.1 lakh)\n- Section 66D: Phishing/Cheating (3 years)\n- Section 66E: Privacy violation (3 years + Rs.2 lakh)\n- Section 66F: Cyber terrorism (Life imprisonment)\n- Section 67: Obscene content (3-5 years)\n\nDPDP Act 2023:\nRegulates personal data protection with fines up to Rs.250 crore.\n\nAsk about any specific section for more details!"
    },
    {
      patterns: ["wifi", "public wifi", "wifi security", "safe wifi", "hotspot"],
      response: "WIFI SECURITY\n\nPublic WiFi Risks:\n- Man-in-the-middle attacks\n- Data interception\n- Fake hotspots\n- Session hijacking\n\nSafe Practices:\n- Use VPN on public WiFi\n- Avoid banking on public networks\n- Turn off auto-connect\n- Use HTTPS websites only\n- Forget networks after use\n\nHome WiFi Security:\n- Use WPA3/WPA2 encryption\n- Change default router password\n- Update router firmware\n- Hide network SSID\n- Enable guest network for visitors"
    },
    {
      patterns: ["ddos", "denial of service", "website down", "server attack"],
      response: "DDOS ATTACKS\n\nWhat is DDoS?\nDistributed Denial of Service - overwhelming servers with traffic to make them unavailable.\n\nSigns of Attack:\n- Website extremely slow or unresponsive\n- Unusual traffic spikes\n- Connection timeouts\n\nProtection:\n- Use DDoS protection services (Cloudflare, AWS Shield)\n- Implement traffic filtering\n- Have redundant infrastructure\n- Monitor traffic patterns\n\nIf Under Attack:\n1. Contact your hosting provider\n2. Enable DDoS protection\n3. Report to CERT-In\n4. Document the incident"
    },
    {
      patterns: ["identity theft", "identity stolen", "someone using my identity", "identity fraud"],
      response: "IDENTITY THEFT\n\nSigns of Identity Theft:\n- Unknown accounts or loans in your name\n- Bills for services you didn't use\n- Credit score drops unexpectedly\n- IRS notices for income you didn't earn\n- Medical bills for treatments you didn't receive\n\nImmediate Steps:\n1. File police complaint\n2. Report to cybercrime.gov.in\n3. Notify all banks and financial institutions\n4. Place fraud alerts on credit reports\n5. Change all passwords\n6. Monitor credit reports closely\n\nPrevention:\n- Never share Aadhaar, PAN, or personal documents via email\n- Shred sensitive documents\n- Use strong, unique passwords\n- Enable 2FA on all accounts"
    },
    {
      patterns: ["otp", "otp fraud", "otp scam", "someone asking otp", "share otp"],
      response: "OTP FRAUD\n\nIMPORTANT: Never share OTP with anyone!\n\nCommon OTP Scams:\n- Caller pretending to be bank employee\n- Fake KYC update requests\n- Prize/lottery winning claims\n- Refund processing calls\n- Delivery agent asking for OTP\n\nHow to Protect Yourself:\n- Banks NEVER ask for OTP over phone\n- No legitimate company needs your OTP\n- Hang up on suspicious calls immediately\n- Report fraud calls to 1930\n- Block suspicious numbers\n\nIf You Shared OTP:\n1. Call bank immediately to block card/account\n2. File complaint at cybercrime.gov.in\n3. Call 1930 helpline"
    },
    {
      patterns: ["sim swap", "sim swapping", "sim cloning", "mobile takeover", "sim fraud"],
      response: "SIM SWAP FRAUD\n\nWhat is SIM Swap?\nFraudsters get a duplicate SIM of your number to access OTPs and banking accounts.\n\nWarning Signs:\n- Sudden loss of mobile network\n- Unable to make calls or receive SMS\n- Bank notifications you didn't initiate\n\nPrevention:\n- Don't share mobile number publicly\n- Set up SIM lock/PIN\n- Use app-based 2FA instead of SMS\n- Register for bank transaction alerts on email too\n\nIf Network Suddenly Gone:\n1. Contact mobile provider immediately\n2. Ask if duplicate SIM was issued\n3. Block banking transactions\n4. Report to cybercrime.gov.in"
    },
    {
      patterns: ["crypto", "cryptocurrency", "bitcoin scam", "crypto fraud", "investment scam"],
      response: "CRYPTOCURRENCY SCAMS\n\nCommon Crypto Scams:\n- Fake investment platforms promising high returns\n- Celebrity endorsement scams\n- Pump and dump schemes\n- Fake exchange platforms\n- Romance scams asking for crypto\n\nRed Flags:\n- Guaranteed profits\n- Pressure to invest quickly\n- Celebrity endorsements on unknown platforms\n- Requests to pay in crypto\n\nProtection:\n- Research before investing\n- Use only verified exchanges\n- Never share wallet keys\n- Be skeptical of unrealistic returns\n\nReporting:\n- cybercrime.gov.in\n- RBI Ombudsman for financial fraud"
    },
    {
      patterns: ["sextortion", "blackmail", "intimate photos", "private photos leaked", "video call blackmail"],
      response: "SEXTORTION\n\nWhat is Sextortion?\nBlackmail using real or fake intimate content to extort money.\n\nImmediate Steps if Targeted:\n1. Do NOT pay the blackmailer\n2. Save all evidence (screenshots, messages)\n3. Report to cybercrime.gov.in immediately\n4. Call 1930 helpline\n5. Block the person on all platforms\n\nImportant:\n- Paying rarely stops blackmail\n- Under Section 66E of IT Act, this is punishable\n- Police take these cases seriously\n\nPrevention:\n- Be cautious with video calls from strangers\n- Never share intimate content online\n- Cover webcam when not in use"
    },
    {
      patterns: ["job fraud", "fake job", "job scam", "work from home fraud", "recruitment scam"],
      response: "JOB FRAUD\n\nCommon Job Scams:\n- Work from home with high pay\n- Data entry jobs with registration fee\n- YouTube like/subscribe jobs\n- Instagram promotion schemes\n- Fake company hiring emails\n\nRed Flags:\n- Upfront payment required\n- No interview or quick hiring\n- High pay for simple tasks\n- Communication only via WhatsApp\n- No company website/address\n\nProtection:\n- Research company before applying\n- Never pay for jobs\n- Verify job postings on official websites\n- Report fraud to cybercrime.gov.in\n\nLegitimate companies NEVER ask for money upfront."
    },
    {
      patterns: ["loan app", "instant loan", "lending app", "loan fraud", "loan harassment"],
      response: "LOAN APP FRAUD\n\nDangers of Illegal Loan Apps:\n- Access all your contacts and photos\n- Extremely high interest rates\n- Harassment calls to you and contacts\n- Morphed photos as blackmail\n\nIf Being Harassed:\n1. File complaint at cybercrime.gov.in\n2. Report to RBI (rbi.org.in)\n3. File FIR at local police station\n4. Keep evidence of harassment\n\nProtection:\n- Only use RBI-registered NBFCs\n- Check app permissions before installing\n- Verify lender credentials\n- Read terms carefully\n\nRBI List of authorized digital lenders: rbi.org.in"
    },
    {
      patterns: ["qr code", "qr scam", "qr code fraud", "scan qr"],
      response: "QR CODE SCAMS\n\nImportant: QR codes are for PAYING, not receiving money!\n\nCommon QR Scams:\n- Seller asks you to scan QR to 'receive' payment\n- Fake customer care QR codes\n- Malicious QR codes on public places\n\nHow It Works:\n- Scanning a QR and entering PIN = Paying money\n- Never scan QR if someone says 'you will receive money'\n\nProtection:\n- Never scan unknown QR codes\n- For receiving money, share your UPI ID or number\n- Report fraud to 1930\n\nRemember: You DON'T need to scan QR or enter PIN to receive money!"
    },
    {
      patterns: ["section 66", "66 of it act", "hacking law"],
      response: "SECTION 66 OF IT ACT\n\nSection 66 - Computer Related Offences\n\nCovers:\n- Unauthorized access to computer systems\n- Data theft or destruction\n- Spreading viruses or malware\n- Hacking into systems\n\nPenalty:\n- Imprisonment up to 3 years\n- Fine up to Rs 5 lakh\n- Or both\n\nRelated Sections:\n- 66A: Offensive messages (struck down by Supreme Court)\n- 66B: Receiving stolen computer data\n- 66C: Identity theft\n- 66D: Cheating by personation\n- 66E: Privacy violation\n- 66F: Cyber terrorism"
    },
    {
      patterns: ["section 67", "obscene content", "pornography law"],
      response: "SECTION 67 OF IT ACT\n\nSection 67 - Obscene Material\n\nCovers:\n- Publishing obscene material electronically\n- Transmitting sexually explicit content\n- Hosting obscene content on websites\n\nPenalty:\n- First offense: 3 years + Rs 5 lakh fine\n- Second offense: 5 years + Rs 10 lakh fine\n\nRelated Sections:\n- 67A: Sexually explicit content (5 years + Rs 10 lakh)\n- 67B: Child pornography (5-7 years + Rs 10 lakh)\n\nReport such content:\n- cybercrime.gov.in\n- NCB (National Commission for Women) for women-related crimes"
    },
    {
      patterns: ["online harassment", "cyber bullying", "trolling", "hate message", "threatening online"],
      response: "ONLINE HARASSMENT\n\nTypes:\n- Cyber bullying and trolling\n- Threatening messages\n- Hate speech\n- Stalking on social media\n- Defamation\n\nLegal Protection:\n- Section 66A IT Act (struck down, but 507 IPC applicable)\n- Section 354D IPC for stalking\n- Section 499/500 IPC for defamation\n- Section 506 IPC for criminal intimidation\n\nSteps to Take:\n1. Screenshot and save all evidence\n2. Block the harasser\n3. Report to platform (most have report options)\n4. File complaint at cybercrime.gov.in\n5. File FIR if threats are serious"
    },
    {
      patterns: ["safe online", "internet safety", "online safety", "safe browsing", "stay safe online"],
      response: "ONLINE SAFETY TIPS\n\nBasic Protection:\n- Use strong, unique passwords\n- Enable 2FA on all accounts\n- Keep software updated\n- Install reputable antivirus\n\nSafe Browsing:\n- Look for HTTPS in URLs\n- Don't click unknown links\n- Avoid suspicious downloads\n- Use ad blockers\n\nSocial Media Safety:\n- Limit personal info sharing\n- Review privacy settings regularly\n- Be cautious of friend requests from strangers\n- Don't share location publicly\n\nFinancial Safety:\n- Never share OTP, PIN, or CVV\n- Use official banking apps only\n- Monitor transactions regularly\n- Report suspicious activity immediately"
    },
    {
      patterns: ["antivirus", "which antivirus", "best antivirus", "free antivirus"],
      response: "ANTIVIRUS SOFTWARE\n\nRecommended Options:\n\nFree:\n- Windows Defender (built-in, good protection)\n- Avast Free\n- AVG Free\n- Bitdefender Free\n\nPaid (more features):\n- Norton 360\n- Kaspersky\n- Bitdefender Total Security\n- McAfee\n\nTips:\n- Keep antivirus updated\n- Run regular scans\n- Don't install multiple antivirus programs\n- Windows Defender is sufficient for most users\n\nMobile:\n- Android: Built-in Play Protect\n- iPhone: Generally doesn't need antivirus\n- Download apps only from official stores"
    },
    {
      patterns: ["backup", "data backup", "how to backup", "backup data"],
      response: "DATA BACKUP\n\nWhy Backup?\n- Protection against ransomware\n- Hardware failure recovery\n- Accidental deletion recovery\n\nBackup Methods:\n\n1. Cloud Backup:\n- Google Drive, OneDrive, iCloud\n- Automatic sync\n- Accessible anywhere\n\n2. External Hard Drive:\n- Full local backup\n- Keep disconnected when not backing up\n- Store in safe location\n\n3. 3-2-1 Rule:\n- 3 copies of data\n- 2 different storage types\n- 1 offsite/cloud\n\nFrequency:\n- Critical data: Daily\n- General files: Weekly\n- Full system: Monthly"
    }
  ];

  // Check FAQ patterns first for direct matching
  for (const faq of faqPatterns) {
    for (const pattern of faq.patterns) {
      if (lowerInput.includes(pattern)) {
        return faq.response;
      }
    }
  }

  // Handle cybersecurity general questions
  if (
    lowerInput.includes("cybersecurity") ||
    lowerInput.includes("cyber security")
  ) {
    return "CYBERSECURITY\n\nDefinition: Cybersecurity involves protecting systems, networks, and data from digital attacks, unauthorized access, or damage.\n\nKey Areas:\n- Network Security\n- Endpoint Security\n- Application Security\n- Data Protection\n- Cloud Security\n\nCommon Threats: Phishing, Ransomware, Malware, DDoS attacks\n\nProtection Measures: Encryption, Firewalls, MFA, Regular updates, Security awareness\n\nWould you like to know more about any specific aspect?";
  }

  for (const law of cybersecurityData.cyberLaws) {
    const section = law.section.toLowerCase();
    const description = law.description.toLowerCase();
    const penalty = law.penalty.toLowerCase();
    const sectionNumber = section.match(/\d+[A-Za-z]*/g)?.[0] || "";
    const sectionWords = section.split(/\s+/);

    let score = 0;

    if (lowerInput.includes(section)) {
      score += 15;
    }

    if (lowerInput.includes(sectionNumber)) {
      score += 10;
    } else if (
      sectionNumber.length > 2 &&
      lowerInput.includes(sectionNumber.substring(0, 2))
    ) {
      score += 5;
    }

    for (const token of tokens) {
      if (description.includes(token) || penalty.includes(token)) {
        score += 3;
      }
      if (sectionWords.includes(token)) {
        score += 2;
      } else if (
        sectionWords.some(
          (word) => getLevenshteinDistance(token, word) <= TYPO_THRESHOLD
        )
      ) {
        score += 1;
      }
    }

    score += getWordOverlapScore(tokens, sectionWords) * 2;

    if (
      (lowerInput.includes("fine") || lowerInput.includes("penalty")) &&
      (penalty.includes("fine") || penalty.includes("imprisonment"))
    ) {
      score += 3;
    }

    if (
      (lowerInput.includes("hack") || lowerInput.includes("hacking")) &&
      (description.includes("hack") ||
        description.includes("unauthorized") ||
        description.includes("computer-related"))
    ) {
      score += 3;
    }

    if (intents.includes("definition")) {
      score += 2;
    }

    if (score > 0) {
      matches.push(new ScoredMatch("law", law, score));
    }
  }

  for (const scenario of cybersecurityData.emergencyScenarios) {
    for (const keyword of scenario.keywords) {
      const keywordWords = keyword.split(/\s+/);
      let score = 0;

      if (lowerInput.includes(keyword)) {
        score += 10;
      }

      for (const token of tokens) {
        if (keywordWords.includes(token)) {
          score += 3;
        } else if (
          keywordWords.some(
            (word) => getLevenshteinDistance(token, word) <= TYPO_THRESHOLD
          )
        ) {
          score += 1;
        }
      }

      score += getWordOverlapScore(tokens, keywordWords) * 2;

      if (intents.includes("action") || intents.includes("report")) {
        score += 5;
      }

      if (score > 0) {
        matches.push(new ScoredMatch("emergency", scenario, score));
        break;
      }
    }
  }

  for (const threat of cybersecurityData.threatTypes) {
    const threatName = threat.name.toLowerCase();
    const threatDescription = threat.description.toLowerCase();
    const threatWords = threatName.split(/\s+/);
    let score = 0;

    if (lowerInput.includes(threatName)) {
      score += 10;
    }

    for (const token of tokens) {
      if (threatWords.includes(token)) {
        score += 3;
      } else if (
        threatWords.some(
          (word) => getLevenshteinDistance(token, word) <= TYPO_THRESHOLD
        )
      ) {
        score += 1;
      }

      if (threatDescription.includes(token)) {
        score += 2;
      }
    }

    score += getWordOverlapScore(tokens, threatWords) * 2;

    if (intents.includes("definition")) {
      score += 2;
    } else if (intents.includes("action")) {
      score += 3;
    }

    if (score > 0) {
      matches.push(new ScoredMatch("threat", threat, score));
    }
  }

  for (const practice of cybersecurityData.bestPractices) {
    const keywords = practice.keywords.map((k) => k.toLowerCase());
    const practiceName = practice.name.toLowerCase();
    const practiceWords = practiceName.split(/\s+/);
    let score = 0;

    for (const keyword of keywords) {
      if (lowerInput.includes(keyword)) {
        score += 5;
      }
    }

    for (const token of tokens) {
      if (keywords.includes(token)) {
        score += 3;
      } else if (
        keywords.some(
          (keyword) => getLevenshteinDistance(token, keyword) <= TYPO_THRESHOLD
        )
      ) {
        score += 1;
      }

      if (practiceName.includes(token)) {
        score += 2;
      }
    }

    score += getWordOverlapScore(tokens, practiceWords) * 2;

    if (intents.includes("action")) {
      score += 5;
    }

    if (score > 0) {
      matches.push(new ScoredMatch("practice", practice, score));
    }
  }

  for (const vector of cybersecurityData.attackVectors) {
    const keywords = vector.keywords.map((k) => k.toLowerCase());
    const vectorName = vector.name.toLowerCase();
    const vectorWords = vectorName.split(/\s+/);
    let score = 0;

    for (const keyword of keywords) {
      if (lowerInput.includes(keyword)) {
        score += 5;
      }
    }

    for (const token of tokens) {
      if (keywords.includes(token)) {
        score += 3;
      } else if (
        keywords.some(
          (keyword) => getLevenshteinDistance(token, keyword) <= TYPO_THRESHOLD
        )
      ) {
        score += 1;
      }

      if (vectorName.includes(token)) {
        score += 2;
      }
    }

    score += getWordOverlapScore(tokens, vectorWords) * 2;

    if (intents.includes("action")) {
      score += 3;
    }

    if (score > 0) {
      matches.push(new ScoredMatch("vector", vector, score));
    }
  }

  for (const response of cybersecurityData.incidentResponse) {
    const keywords = response.keywords.map((k) => k.toLowerCase());
    const responseName = response.name.toLowerCase();
    const responseWords = responseName.split(/\s+/);
    let score = 0;

    for (const keyword of keywords) {
      if (lowerInput.includes(keyword)) {
        score += 5;
      }
    }

    for (const token of tokens) {
      if (keywords.includes(token)) {
        score += 3;
      } else if (
        keywords.some(
          (keyword) => getLevenshteinDistance(token, keyword) <= TYPO_THRESHOLD
        )
      ) {
        score += 1;
      }

      if (responseName.includes(token)) {
        score += 2;
      }
    }

    score += getWordOverlapScore(tokens, responseWords) * 2;

    if (intents.includes("report")) {
      score += 5;
    }

    if (score > 0) {
      matches.push(new ScoredMatch("incidentResponse", response, score));
    }
  }

  if (
    intents.includes("action") ||
    lowerInput.includes("protect") ||
    lowerInput.includes("prevent") ||
    lowerInput.includes("tips") ||
    lowerInput.includes("myself")
  ) {
    const relevantTips =
      cybersecurityData.preventiveTips
        .filter((tip) => {
          const tipWords = tip.tip.toLowerCase().split(/\s+/);
          return tokens.some(
            (token) =>
              tipWords.includes(token) ||
              tipWords.some(
                (word) => getLevenshteinDistance(token, word) <= TYPO_THRESHOLD
              )
          );
        })
        .slice(0, 5)
        .map((tip) => `- ${tip.tip}`)
        .join("\n") ||
      cybersecurityData.preventiveTips
        .slice(0, 5)
        .map((tip) => `- ${tip.tip}`)
        .join("\n");
    matches.push(
      new ScoredMatch(
        "tips",
        { description: `👤 Protection Tips\n${relevantTips}` },
        12
      )
    );
  }

  if (
    intents.includes("report") ||
    lowerInput.includes("report") ||
    lowerInput.includes("cybercrime")
  ) {
    const channels = cybersecurityData.reportingChannels
      .slice(0, 3)
      .map((channel) => `- ${channel.name}: ${channel.urlOrContact}`)
      .join("\n");
    matches.push(
      new ScoredMatch(
        "reporting",
        { description: `👤 Reporting Channels\n${channels}` },
        12
      )
    );
  }

  matches.sort((a, b) => b.score - a.score);

  if (matches.length === 0 || matches[0].confidence < CONFIDENCE_THRESHOLD) {
    const allKeywords = [
      ...cybersecurityData.cyberLaws.map((law) => law.section.toLowerCase()),
      ...cybersecurityData.emergencyScenarios.flatMap((s) => s.keywords),
      ...cybersecurityData.threatTypes.map((t) => t.name.toLowerCase()),
      ...cybersecurityData.bestPractices.flatMap((p) => p.keywords),
      ...cybersecurityData.attackVectors.flatMap((v) => v.keywords),
      ...cybersecurityData.incidentResponse.flatMap((r) => r.keywords),
    ];
    const suggestion = getClosestMatch(tokens, allKeywords);
    return `I couldn't find a confident match for your query. ${suggestion}\nTry asking about specific cyber threats (e.g., phishing), laws (e.g., Section 66 of IT Act), or protection tips.`;
  }

  const topMatch = matches[0];

  switch (topMatch.type) {
    case "law":
      if (intents.includes("definition")) {
        return `🛡️ ${topMatch.item.section}\nDescription: ${topMatch.item.description}\nPenalty: ${topMatch.item.penalty}`;
      } else if (intents.includes("action")) {
        return `🛡️ ${topMatch.item.section}\nTo address issues related to ${topMatch.item.description}, consult a legal expert or report to https://cybercrime.gov.in.`;
      } else if (intents.includes("report")) {
        return `🛡️ ${topMatch.item.section}\nTo report a violation, visit https://cybercrime.gov.in or contact your local cybercrime cell.`;
      } else {
        return `🛡️ ${topMatch.item.section}\nDescription: ${topMatch.item.description}\nPenalty: ${topMatch.item.penalty}`;
      }

    case "emergency":
      return `👤 Emergency Response\n${topMatch.item.response}`;

    case "threat":
      if (intents.includes("definition")) {
        return `${topMatch.item.name}\nDescription: ${topMatch.item.description}\nSeverity: ${topMatch.item.severity}`;
      } else if (intents.includes("action")) {
        return `👤 Protection from ${topMatch.item.name}\n${topMatch.item.preventionMeasures}`;
      } else if (intents.includes("report")) {
        return `👤 Reporting ${topMatch.item.name}\nTo report, visit https://cybercrime.gov.in or call 1930.`;
      } else {
        return `${topMatch.item.name}\nDescription: ${topMatch.item.description}\nPrevention: ${topMatch.item.preventionMeasures}`;
      }

    case "practice":
      return `👤 ${topMatch.item.name}\nDescription: ${topMatch.item.description
        }\nSteps: ${topMatch.item.steps.join(", ")}`;

    case "vector":
      if (intents.includes("definition")) {
        return `${topMatch.item.name}\nDescription: ${topMatch.item.description}`;
      } else if (intents.includes("intent")) {
        return `👤 Protection from ${topMatch.item.name}\n${topMatch.item.prevention}`;
      } else if (intents.includes("report")) {
        return `👤 Reporting ${topMatch.item.name}\nTo report, visit https://cybercrime.gov.in or call 1930.`;
      } else {
        return `${topMatch.item.name}\nDescription: ${topMatch.item.description}\nPrevention: ${topMatch.item.prevention}`;
      }

    case "incidentResponse":
      return `👤 ${topMatch.item.name}\nDescription: ${topMatch.item.description
        }\nSteps: ${topMatch.item.steps.join(", ")}`;

    case "tips":
      return topMatch.item.description;

    case "reporting":
      return topMatch.item.description;

    default:
      return "I found some information, but I'm not sure how to categorize it. Could you clarify your question?";
  }
};

const cybersecurityData = {
  threatTypes: [
    {
      name: "Phishing",
      description:
        "Deceptive attempts to steal sensitive information by disguising as a trustworthy entity, often via email or fake websites.",
      preventionMeasures:
        "Verify sender emails, avoid clicking suspicious links, enable multi-factor authentication (MFA), use email filtering tools.",
      severity: "High",
      examples: [
        "Fake bank login pages",
        "Spear phishing targeting executives",
      ],
    },
    {
      name: "Ransomware",
      description:
        "Malware that encrypts files and demands payment for decryption keys, often spreading through malicious attachments or links.",
      preventionMeasures:
        "Maintain regular backups, apply security updates promptly, use email filtering, conduct security awareness training.",
      severity: "Critical",
      examples: ["WannaCry", "Ryuk"],
    },
    {
      name: "Data Breach",
      description:
        "Unauthorized access to sensitive or protected data, leading to potential data theft or exposure.",
      preventionMeasures:
        "Implement data encryption, enforce strict access controls, use strong authentication, conduct regular security audits.",
      severity: "Critical",
      examples: ["Equifax breach", "LinkedIn data scrape"],
    },
    {
      name: "Social Engineering",
      description:
        "Manipulating individuals into divulging confidential information or performing actions that compromise security.",
      preventionMeasures:
        "Provide security awareness training, establish verification procedures, adopt a zero-trust security model.",
      severity: "High",
      examples: ["Pretexting", "Baiting with USB drives"],
    },
    {
      name: "DDoS",
      description:
        "Distributed Denial of Service attacks that overwhelm servers with traffic to disrupt services and availability.",
      preventionMeasures:
        "Deploy DDoS protection services, implement traffic filtering, maintain redundant infrastructure, scale bandwidth as needed.",
      severity: "High",
      examples: ["Mirai botnet", "Dyn attack"],
    },
    {
      name: "Malware",
      description:
        "Malicious software designed to damage, disrupt, or gain unauthorized access to systems, including viruses, worms, and trojans.",
      preventionMeasures:
        "Install anti-malware software, keep systems updated, scan emails and files, verify links before clicking.",
      severity: "High",
      examples: ["Trojan horses", "Spyware"],
    },
    {
      name: "Insider Threats",
      description:
        "Malicious or unintentional actions by employees or contractors that compromise organizational security.",
      preventionMeasures:
        "Enforce strict access controls, monitor user activities, conduct regular audits, provide employee training.",
      severity: "Critical",
      examples: [
        "Data theft by disgruntled employees",
        "Accidental data leaks",
      ],
    },
    {
      name: "Zero-Day Exploits",
      description:
        "Attacks exploiting previously unknown vulnerabilities in software before patches are available.",
      preventionMeasures:
        "Keep software updated, use intrusion detection systems, monitor security advisories from vendors.",
      severity: "Critical",
      examples: ["Stuxnet", "Log4j vulnerability"],
    },
    {
      name: "Man-in-the-Middle",
      description:
        "Interception of communication between two systems to steal or alter data without detection.",
      preventionMeasures:
        "Use encrypted connections (HTTPS, VPN), avoid public Wi-Fi for sensitive transactions, verify SSL certificates.",
      severity: "High",
      examples: ["Eavesdropping on unsecured Wi-Fi", "Session hijacking"],
    },
    {
      name: "SQL Injection",
      description:
        "Insertion of malicious SQL code into input fields to manipulate or access databases unauthorizedly.",
      preventionMeasures:
        "Implement input validation, use prepared statements, conduct regular security testing of applications.",
      severity: "High",
      examples: ["Database leaks", "Unauthorized data access"],
    },
    {
      name: "Cryptojacking",
      description:
        "Unauthorized use of a victim's computing resources to mine cryptocurrency.",
      preventionMeasures:
        "Monitor system performance, use ad-blockers, install anti-malware tools capable of detecting cryptojacking scripts.",
      severity: "Moderate",
      examples: ["Coinhive scripts", "Browser-based mining"],
    },
    {
      name: "Password Attacks",
      description:
        "Attempts to steal or crack passwords using brute force, dictionary attacks, or credential stuffing.",
      preventionMeasures:
        "Use strong, unique passwords, enable MFA, limit login attempts to prevent brute force attacks.",
      severity: "High",
      examples: [
        "Brute force attacks",
        "Credential stuffing from leaked databases",
      ],
    },
    {
      name: "Spyware",
      description:
        "Malware that secretly monitors user activities and collects sensitive information without consent.",
      preventionMeasures:
        "Install reputable anti-spyware tools, avoid downloading from untrusted sources, monitor system behavior.",
      severity: "High",
      examples: ["Keyloggers", "Screen recorders"],
    },
    {
      name: "Rootkits",
      description:
        "Malware that hides its presence to gain persistent, privileged access to a system.",
      preventionMeasures:
        "Use anti-rootkit tools, keep systems updated, perform regular integrity checks.",
      severity: "Critical",
      examples: ["Necurs", "ZeroAccess"],
    },
    {
      name: "Botnets",
      description:
        "Networks of compromised devices controlled by attackers to perform malicious tasks like DDoS or spam campaigns.",
      preventionMeasures:
        "Use firewalls, monitor network traffic, install anti-malware software.",
      severity: "High",
      examples: ["Conficker", "Zeus"],
    },
    {
      name: "Keyloggers",
      description:
        "Malware or hardware that records keystrokes to steal sensitive information like passwords.",
      preventionMeasures:
        "Use virtual keyboards for sensitive inputs, install anti-malware, check for unauthorized hardware.",
      severity: "High",
      examples: ["Olympic Vision", "HawkEye"],
    },
    {
      name: "Adware",
      description:
        "Software that displays unwanted advertisements, often bundled with legitimate downloads.",
      preventionMeasures:
        "Avoid unverified software, use ad-blockers, scan downloads with anti-malware tools.",
      severity: "Moderate",
      examples: ["Superfish", "Fireball"],
    },
    {
      name: "Worms",
      description:
        "Self-replicating malware that spreads across networks without user interaction.",
      preventionMeasures:
        "Keep systems updated, use network firewalls, scan for malware regularly.",
      severity: "High",
      examples: ["Conficker", "Blaster"],
    },
    {
      name: "Skimmers",
      description:
        "Devices or malware that capture card details during transactions, often on ATMs or point-of-sale systems.",
      preventionMeasures:
        "Check for tampering on card readers, use contactless payments, monitor bank statements.",
      severity: "High",
      examples: ["ATM skimmers", "Online payment skimmers"],
    },
    {
      name: "Trojans",
      description:
        "Malware disguised as legitimate software to trick users into installing it.",
      preventionMeasures:
        "Download software from trusted sources, scan files before opening, use anti-malware tools.",
      severity: "High",
      examples: ["Emotet", "TrickBot"],
    },
  ],
  cyberLaws: [
    {
      section: "Section 43 of IT Act",
      description:
        "Penalties for unauthorized access or damage to computer systems without permission.",
      penalty: "Compensation up to ₹1 crore to the affected person.",
    },
    {
      section: "Section 66 of IT Act",
      description:
        "Computer-related offenses performed with criminal intent, such as hacking or data theft.",
      penalty: "Imprisonment up to 3 years or fine up to ₹5 lakh or both.",
    },
    {
      section: "Section 66C of IT Act",
      description:
        "Identity theft using electronic signatures, passwords, or other unique identification features.",
      penalty: "Imprisonment up to 3 years and fine up to ₹1 lakh.",
    },
    {
      section: "Section 66F of IT Act",
      description:
        "Cyber terrorism that threatens the unity, integrity, or security of India.",
      penalty: "Imprisonment for life.",
    },
    {
      section: "Section 66E of IT Act",
      description:
        "Violation of privacy by capturing, publishing, or transmitting images of private areas without consent.",
      penalty: "Imprisonment up to 3 years or fine up to ₹2 lakh or both.",
    },
    {
      section: "Section 67 of IT Act",
      description:
        "Publishing or transmitting obscene material in electronic form.",
      penalty: "Imprisonment up to 3 years and fine up to ₹5 lakh.",
    },
    {
      section: "Section 72 of IT Act",
      description:
        "Breach of confidentiality and privacy by unauthorized access to electronic records.",
      penalty: "Imprisonment up to 2 years or fine up to ₹1 lakh or both.",
    },
    {
      section: "Section 43A of IT Act",
      description:
        "Failure to protect sensitive personal data, leading to wrongful loss or gain.",
      penalty: "Compensation to the affected person as deemed appropriate.",
    },
    {
      section: "Section 66D of IT Act",
      description:
        "Cheating by personation using computer resources, such as phishing scams.",
      penalty: "Imprisonment up to 3 years and fine up to ₹1 lakh.",
    },
    {
      section: "Section 67B of IT Act",
      description:
        "Publishing or transmitting material depicting children in sexually explicit acts in electronic form.",
      penalty:
        "Imprisonment up to 5 years and fine up to ₹10 lakh on first conviction.",
    },
    {
      section: "Digital Personal Data Protection Act 2023",
      description:
        "Regulates the processing, storage, and protection of personal data in India.",
      penalty: "Fines up to ₹250 crore for non-compliance.",
    },
    {
      section: "Information Technology Rules 2021",
      description:
        "Guidelines for intermediaries, social media platforms, and digital media to ensure compliance and user safety.",
      penalty: "Fines and legal action based on non-compliance severity.",
    },
    {
      section: "Section 70B of IT Act",
      description:
        "Establishes CERT-In as the national agency for handling cybersecurity incidents.",
      penalty: "Varies based on incident and non-compliance.",
    },
    {
      section: "BNS Section 318",
      description:
        "Addresses cheating and fraud, including cyber fraud, under the Bharatiya Nyaya Sanhita.",
      penalty: "Imprisonment up to 7 years and fine.",
    },
    {
      section: "Section 69 of IT Act",
      description:
        "Empowers the government to intercept, monitor, or decrypt information for security reasons.",
      penalty: "Imprisonment up to 7 years and fine.",
    },
  ],
  reportingChannels: [
    {
      name: "National Cyber Crime Reporting Portal",
      urlOrContact: "https://cybercrime.gov.in",
      description:
        "Official portal for reporting all types of cybercrimes in India, available in multiple languages with a 24/7 helpline.",
    },
    {
      name: "Cyber Crime Helpline",
      urlOrContact: "1930",
      description:
        "National helpline number for immediate reporting of financial frauds and other cybercrimes.",
    },
    {
      name: "Local Police Cyber Cell",
      urlOrContact: "Check your city's police website",
      description:
        "Dedicated cyber cells in major cities to handle local cybercrime complaints and investigations.",
    },
    {
      name: "CERT-In",
      urlOrContact: "https://www.cert-in.org.in",
      description:
        "Indian Computer Emergency Response Team for reporting vulnerabilities, incidents, and seeking technical assistance.",
    },
    {
      name: "Reserve Bank of India Ombudsman",
      urlOrContact: "https://www.rbi.org.in",
      description:
        "For reporting cyber frauds related to banking and financial transactions, including unauthorized payments.",
    },
    {
      name: "Telecom Regulatory Authority of India",
      urlOrContact: "https://www.trai.gov.in",
      description:
        "Report issues related to telecom-based cybercrimes, such as SMS phishing or fraudulent calls.",
    },
    {
      name: "Delhi Cyber Crime Cell",
      urlOrContact: "https://delhipolice.gov.in",
      description:
        "Dedicated unit for handling cybercrimes in Delhi, including fraud and hacking.",
    },
    {
      name: "Mumbai Cyber Police",
      urlOrContact: "https://mumbaipolice.gov.in",
      description:
        "Specialized cybercrime unit for Mumbai residents to report incidents.",
    },
    {
      name: "Bangalore Cyber Crime Police",
      urlOrContact: "https://bcp.karnataka.gov.in",
      description:
        "Cybercrime unit for Bangalore residents to report online fraud and cyber incidents.",
    },
    {
      name: "Chennai Cyber Crime Cell",
      urlOrContact: "https://tnpolice.gov.in",
      description:
        "Dedicated unit for handling cybercrimes in Chennai, including phishing and data breaches.",
    },
    {
      name: "Hyderabad Cyber Crime Police",
      urlOrContact: "https://hyderabadpolice.gov.in",
      description:
        "Cybercrime unit for Hyderabad residents to report hacking, fraud, and other incidents.",
    },
    {
      name: "INTERPOL Cybercrime Division",
      urlOrContact: "https://www.interpol.int",
      description:
        "For reporting international cybercrimes or cross-border incidents.",
    },
  ],
  preventiveTips: [
    {
      tip: "Use strong, unique passwords and a reputable password manager to store them securely.",
    },
    {
      tip: "Enable two-factor authentication (2FA) or multi-factor authentication (MFA) on all accounts.",
    },
    {
      tip: "Keep all software, operating systems, and devices updated with the latest security patches.",
    },
    {
      tip: "Be cautious about sharing personal information on social media platforms.",
    },
    {
      tip: "Regularly back up important data to secure, offline, or cloud-based storage.",
    },
    {
      tip: "Use a virtual private network (VPN) when connecting to public Wi-Fi networks.",
    },
    {
      tip: "Verify email senders before clicking links or opening attachments to avoid phishing.",
    },
    {
      tip: "Install and maintain updated antivirus/anti-malware software on all devices.",
    },
    {
      tip: "Use encrypted communication channels (e.g., HTTPS, secure email) for sensitive information.",
    },
    {
      tip: "Regularly review and update privacy settings on all accounts and devices.",
    },
    { tip: "Avoid reusing passwords across multiple accounts to reduce risk." },
    {
      tip: "Monitor system performance to detect unusual activity, such as cryptojacking.",
    },
    {
      tip: "Be wary of unsolicited requests for personal or financial information.",
    },
    {
      tip: "Use secure, reputable websites for online transactions, checking for HTTPS and padlock icons.",
    },
    {
      tip: "Conduct regular security awareness training for employees in organizational settings.",
    },
    {
      tip: "Implement network segmentation to limit the spread of potential attacks.",
    },
    {
      tip: "Use firewall settings to block unauthorized access to your network.",
    },
    { tip: "Regularly review account activity logs for suspicious behavior." },
    { tip: "Secure IoT devices with strong passwords and updated firmware." },
    {
      tip: "Use cloud security tools to protect data stored in cloud environments.",
    },
    { tip: "Enable email encryption for sensitive communications." },
    { tip: "Avoid downloading apps from unofficial app stores." },
    { tip: "Use browser extensions to block trackers and malicious scripts." },
    {
      tip: "Regularly update router firmware to prevent network vulnerabilities.",
    },
    { tip: "Use biometric authentication where available for added security." },
    { tip: "Avoid sharing sensitive data over unsecured messaging apps." },
    { tip: "Use secure DNS services to protect against malicious websites." },
    { tip: "Limit app permissions to only what is necessary." },
  ],
  emergencyScenarios: [
    {
      scenario: "phishing",
      keywords: [
        "phish",
        "email",
        "link",
        "clicked",
        "suspicious email",
        "fake website",
        "spoofed email",
        "phising",
      ],
      response:
        "If you suspect a phishing attempt:\n- Do not click any links or download attachments\n- Avoid sharing personal information in response\n- Verify the sender's email address carefully\n- Report the email to your IT department or mark as spam\n- If you clicked a link, disconnect from the internet and run a full security scan\n- Report to cybercrime.gov.in or call 1930 for assistance.",
    },
    {
      scenario: "account compromise",
      keywords: [
        "hack",
        "breach",
        "compromise",
        "account",
        "stolen",
        "unauthorized login",
        "suspicious activity",
      ],
      response:
        "If you suspect your account has been compromised:\n- Change your password immediately to a strong, unique one\n- Enable two-factor authentication (2FA)\n- Review account activity for unauthorized transactions\n- Contact the service provider to report the issue\n- Freeze financial accounts if linked to the compromised account\n- Report to cybercrime.gov.in or call 1930.",
    },
    {
      scenario: "ransomware",
      keywords: [
        "ransomware",
        "locked",
        "encrypt",
        "ransom",
        "files",
        "payment demand",
        "inaccessible files",
        "ransomeware",
      ],
      response:
        "If hit by ransomware:\n- Disconnect the device from the network immediately\n- Report to your IT department or cybercrime authorities\n- Do NOT pay the ransom, as it encourages criminals and may not recover files\n- Restore from clean backups if available\n- Check for decryption tools specific to the ransomware variant\n- Report to cybercrime.gov.in or call 1930.",
    },
    {
      scenario: "identity theft",
      keywords: [
        "identity",
        "theft",
        "stolen",
        "impersonation",
        "fraudulent activity",
        "stolen identity",
      ],
      response:
        "If you suspect identity theft:\n- File a police complaint immediately\n- Report to cybercrime.gov.in\n- Notify all relevant financial institutions\n- Place fraud alerts on your credit reports\n- Change passwords for all critical accounts\n- Monitor credit reports and financial statements for unauthorized activity.",
    },
    {
      scenario: "data breach",
      keywords: [
        "data breach",
        "unauthorized access",
        "stolen data",
        "hacked database",
        "leaked information",
      ],
      response:
        "If you suspect a data breach:\n- Report to your IT department or cybersecurity team immediately\n- Isolate affected systems to contain the breach\n- Notify authorities like CERT-In or cybercrime.gov.in\n- Assess the scope of the breach and mitigate further damage\n- Inform affected users if personal data was compromised.",
    },
    {
      scenario: "online scam",
      keywords: [
        "scam",
        "fraud",
        "deceived",
        "trick",
        "fake offer",
        "phony investment",
        "bogus deal",
      ],
      response:
        "If you've fallen victim to an online scam:\n- Stop all communication with the scammer\n- Report to cybercrime.gov.in or call 1930\n- Contact your bank to block transactions if financial loss occurred\n- Change passwords for affected accounts\n- Be cautious of follow-up scams targeting victims\n- Document all interactions for evidence.",
    },
    {
      scenario: "malware infection",
      keywords: [
        "malware",
        "virus",
        "trojan",
        "infected",
        "spyware",
        "worm",
        "suspicious program",
      ],
      response:
        "If you suspect a malware infection:\n- Disconnect from the internet to prevent further spread\n- Run a full system scan with updated antivirus software\n- Follow antivirus instructions to remove detected malware\n- Change passwords for accounts accessed from the infected device\n- Seek professional help for severe infections\n- Report to cybercrime.gov.in if data was stolen.",
    },
    {
      scenario: "DDoS attack",
      keywords: [
        "ddos",
        "denial of service",
        "website down",
        "server overload",
        "traffic spike",
      ],
      response:
        "If you suspect a DDoS attack:\n- Contact your ISP or hosting provider immediately\n- Activate DDoS protection services if available\n- Monitor traffic patterns to identify attack sources\n- Consider taking the affected service offline temporarily\n- Report to CERT-In or local cybercrime authorities.",
    },
    {
      scenario: "cryptojacking",
      keywords: [
        "cryptojacking",
        "mining",
        "slow system",
        "high CPU",
        "unauthorized mining",
      ],
      response:
        "If you suspect cryptojacking:\n- Monitor CPU and system performance for unusual activity\n- Run an anti-malware scan to detect mining scripts\n- Use ad-blockers to prevent browser-based cryptojacking\n- Update all software to patch vulnerabilities\n- Report to your IT department or cybercrime.gov.in if confirmed.",
    },
    {
      scenario: "password attack",
      keywords: [
        "password",
        "brute force",
        "credential stuffing",
        "stolen password",
        "login attempts",
      ],
      response:
        "If you suspect a password attack:\n- Change your password to a strong, unique one\n- Enable two-factor authentication (2FA)\n- Monitor account activity for unauthorized access\n- Use a password manager to generate and store secure passwords\n- Report repeated login attempts to the service provider\n- Report to cybercrime.gov.in if credentials were stolen.",
    },
    {
      scenario: "botnet infection",
      keywords: [
        "botnet",
        "compromised device",
        "spam campaign",
        "ddos bot",
        "zombie device",
      ],
      response:
        "If you suspect a botnet infection:\n- Disconnect the device from the network\n- Run a full antivirus scan to detect botnet malware\n- Update all software and remove unauthorized applications\n- Monitor network traffic for unusual patterns\n- Report to cybercrime.gov.in or CERT-In.",
    },
    {
      scenario: "keylogger detection",
      keywords: ["keylogger", "keystroke", "keylogging", "stolen keystrokes"],
      response:
        "If you suspect a keylogger:\n- Use a virtual keyboard for sensitive inputs\n- Run an anti-malware scan to detect keyloggers\n- Check for unauthorized hardware devices\n- Change all passwords from a clean device\n- Report to cybercrime.gov.in if data was stolen.",
    },
    {
      scenario: "worm infection",
      keywords: ["worm", "self-replicating", "network spread", "worms"],
      response:
        "If you suspect a worm infection:\n- Disconnect affected devices from the network\n- Run a full antivirus scan to remove the worm\n- Update all systems to patch vulnerabilities\n- Monitor network traffic for unusual activity\n- Report to cybercrime.gov.in or CERT-In.",
    },
    {
      scenario: "skimming",
      keywords: ["skimmer", "skimming", "card skimmer", "atm fraud"],
      response:
        "If you suspect card skimming:\n- Inspect card readers for tampering\n- Notify your bank immediately\n- Monitor bank statements for unauthorized transactions\n- Use contactless payments where possible\n- Report to cybercrime.gov.in or call 1930.",
    },
    {
      scenario: "trojan infection",
      keywords: ["trojan", "disguised malware", "fake software"],
      response:
        "If you suspect a trojan infection:\n- Disconnect from the internet\n- Run a full antivirus scan to remove the trojan\n- Download software only from trusted sources\n- Change passwords from a clean device\n- Report to cybercrime.gov.in if data was stolen.",
    },
  ],
  bestPractices: [
    {
      name: "Network Security",
      description: "Protecting networks from unauthorized access and attacks.",
      keywords: ["network", "firewall", "security", "intrusion"],
      steps: [
        "Configure firewalls",
        "Use intrusion detection systems",
        "Segment networks",
        "Monitor traffic",
      ],
    },
    {
      name: "Endpoint Security",
      description: "Securing devices like laptops, mobiles, and IoT devices.",
      keywords: ["endpoint", "device", "antivirus", "mobile"],
      steps: [
        "Install antivirus software",
        "Enable device encryption",
        "Update firmware",
        "Use secure boot",
      ],
    },
    {
      name: "Data Protection",
      description:
        "Ensuring the confidentiality and integrity of sensitive data.",
      keywords: ["data", "encryption", "backup", "protection"],
      steps: [
        "Encrypt sensitive data",
        "Regularly back up data",
        "Implement access controls",
        "Audit data access",
      ],
    },
    {
      name: "Application Security",
      description:
        "Securing software applications from vulnerabilities and attacks.",
      keywords: ["application", "app", "software", "secure coding"],
      steps: [
        "Use secure coding practices",
        "Perform regular security testing",
        "Patch applications promptly",
        "Validate user inputs",
      ],
    },
    {
      name: "User Awareness",
      description: "Educating users to recognize and avoid cyber threats.",
      keywords: ["awareness", "training", "user", "education"],
      steps: [
        "Conduct regular training",
        "Simulate phishing attacks",
        "Promote security policies",
        "Encourage reporting",
      ],
    },
    {
      name: "Cloud Security",
      description: "Protecting data and applications in cloud environments.",
      keywords: ["cloud", "cloud security", "SaaS", "IaaS"],
      steps: [
        "Use cloud-native security tools",
        "Encrypt cloud data",
        "Monitor cloud access",
        "Regularly audit configurations",
      ],
    },
  ],
  attackVectors: [
    {
      name: "Drive-by Downloads",
      description:
        "Malware delivered through compromised websites without user interaction.",
      keywords: ["drive-by", "download", "malware site"],
      prevention:
        "Use ad-blockers, keep browsers updated, disable auto-downloads.",
    },
    {
      name: "Watering Hole Attacks",
      description:
        "Compromising websites frequented by a target group to deliver malware.",
      keywords: ["watering hole", "targeted attack", "compromised site"],
      prevention: "Verify website security, use VPNs, avoid suspicious sites.",
    },
    {
      name: "Supply Chain Attacks",
      description:
        "Attacks targeting third-party vendors to compromise their clients.",
      keywords: ["supply chain", "vendor attack", "third-party breach"],
      prevention:
        "Vet third-party vendors, monitor supply chain security, use secure software.",
    },
    {
      name: "Credential Harvesting",
      description:
        "Stealing user credentials through phishing or malicious forms.",
      keywords: ["credential", "harvesting", "login theft"],
      prevention:
        "Use strong passwords, enable MFA, avoid suspicious login pages.",
    },
    {
      name: "Malvertising",
      description:
        "Delivering malware through malicious online advertisements.",
      keywords: ["malvertising", "malicious ad", "adware"],
      prevention:
        "Use ad-blockers, avoid clicking unknown ads, keep browsers updated.",
    },
  ],
  incidentResponse: [
    {
      name: "Incident Identification",
      keywords: ["incident", "detect", "alert", "suspicious"],
      description: "Identifying a potential cybersecurity incident.",
      steps: [
        "Monitor logs",
        "Set up alerts",
        "Analyze unusual activity",
        "Classify incident severity",
      ],
    },
    {
      name: "Containment",
      keywords: ["contain", "isolate", "mitigate", "limit"],
      description: "Limiting the spread of a cybersecurity incident.",
      steps: [
        "Isolate affected systems",
        "Block malicious IPs",
        "Disable compromised accounts",
        "Apply temporary fixes",
      ],
    },
    {
      name: "Recovery",
      keywords: ["recover", "restore", "remediate", "fix"],
      description: "Restoring systems and data after an incident.",
      steps: [
        "Restore from backups",
        "Patch vulnerabilities",
        "Reset credentials",
        "Test system integrity",
      ],
    },
    {
      name: "Post-Incident Analysis",
      keywords: ["analysis", "post-incident", "review", "learn"],
      description: "Analyzing the incident to prevent future occurrences.",
      steps: [
        "Conduct root cause analysis",
        "Update security policies",
        "Train staff",
        "Implement new controls",
      ],
    },
    {
      name: "Communication",
      keywords: ["communicate", "notify", "report incident"],
      description: "Notifying stakeholders about the incident.",
      steps: [
        "Inform affected users",
        "Report to authorities",
        "Document incident details",
        "Issue public statements if needed",
      ],
    },
  ],
};

export default cybersecurityData;