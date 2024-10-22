export interface JobTitleOption {
    value: string;
    label: string;
    emoji: number;
    slug: string;
    plural:string;
    singular:string;
    relatedJobs: string[];
    similarTitles: string[];
    similarTitlesForMeta: string[];

  }

    export const jobTitleOptions: JobTitleOption[] = [
        {
          "value": "Software Engineer",
          "plural": "Software Engineers",
          "singular": "Software Engineer",
          "label": "💻 Software Engineer",
          "emoji": 128187,
          "slug": "software-engineer",
          "similarTitles": [
            "software developer",
            "programmer",
            "coder"
          ],
          "relatedJobs": [
            "Frontend Developer",
            "Backend Developer",
            "Full-stack Developer"
          ],
          "similarTitlesForMeta": [
            "software architect",
            "application developer",
            "systems engineer"
          ]
        },
        {
          "value": "Data Scientist",
          "plural": "Data Scientists",
          "singular": "Data Scientist",
          "label": "📊 Data Scientist",
          "emoji": 128202,
          "slug": "data-scientist",
          "similarTitles": [
            "machine learning engineer",
            "AI researcher",
            "data analyst"
          ],
          "relatedJobs": [
            "Data Analyst",
            "Machine Learning Engineer",
            "Data Engineer"
          ],
          "similarTitlesForMeta": [
            "data science lead",
            "AI scientist",
            "quantitative analyst"
          ]
        },
        {
          "value": "Product Manager",
          "plural": "Product Managers",
          "singular": "Product Manager",
          "label": "✅ Product Manager",
          "emoji": 9989,
          "slug": "product-manager",
          "similarTitles": [
            "product owner",
            "product lead",
            "product strategist"
          ],
          "relatedJobs": [
            "Project Manager",
            "Business Analyst",
            "UX Designer"
          ],
          "similarTitlesForMeta": [
            "digital product manager",
            "technical product manager",
            "product development manager"
          ]
        },
        {
          "value": "UX Designer",
          "plural": "UX Designers",
          "singular": "UX Designer",
          "label": "🎨 UX Designer",
          "emoji": 127912,
          "slug": "ux-designer",
          "similarTitles": [
            "UI designer",
            "interaction designer",
            "user experience architect"
          ],
          "relatedJobs": [
            "Product Designer",
            "Graphic Designer",
            "Web Designer"
          ],
          "similarTitlesForMeta": [
            "UX/UI designer",
            "user experience researcher",
            "interface designer"
          ]
        },
        {
          "value": "Digital Marketing Manager",
          "plural": "Digital Marketing Managers",
          "singular": "Digital Marketing Manager",
          "label": "🌐 Digital Marketing Manager",
          "emoji": 127760,
          "slug": "digital-marketing-manager",
          "similarTitles": [
            "online marketing specialist",
            "digital marketing strategist",
            "internet marketing manager"
          ],
          "relatedJobs": [
            "Content Marketing Manager",
            "SEO Specialist",
            "Social Media Manager"
          ],
          "similarTitlesForMeta": [
            "digital marketing director",
            "e-commerce marketing manager",
            "growth marketing manager"
          ]
        },
        {
          "value": "Content Writer",
          "plural": "Content Writers",
          "singular": "Content Writer",
          "label": "✍️ Content Writer",
          "emoji": 9997,
          "slug": "content-writer",
          "similarTitles": [
            "copywriter",
            "content creator",
            "blog writer"
          ],
          "relatedJobs": [
            "Technical Writer",
            "SEO Specialist",
            "Social Media Manager"
          ],
          "similarTitlesForMeta": [
            "content strategist",
            "digital content writer",
            "content marketing specialist"
          ]
        },
        {
          "value": "Customer Support Representative",
          "plural": "Customer Support Representatives",
          "singular": "Customer Support Representative",
          "label": "🎧 Customer Support Representative",
          "emoji": 127911,
          "slug": "customer-support-representative",
          "similarTitles": [
            "customer service agent",
            "client support specialist",
            "help desk technician"
          ],
          "relatedJobs": [
            "Technical Support Specialist",
            "Customer Success Manager",
            "Account Manager"
          ],
          "similarTitlesForMeta": [
            "customer care representative",
            "customer experience specialist",
            "client services representative"
          ]
        },
        {
          "value": "Project Manager",
          "plural": "Project Managers",
          "singular": "Project Manager",
          "label": "📅 Project Manager",
          "emoji": 128197,
          "slug": "project-manager",
          "similarTitles": [
            "program manager",
            "project coordinator",
            "scrum master"
          ],
          "relatedJobs": [
            "Product Manager",
            "Business Analyst",
            "Team Lead"
          ],
          "similarTitlesForMeta": [
            "agile project manager",
            "technical project manager",
            "project management professional"
          ]
        },
        {
          "value": "Business Analyst",
          "plural": "Business Analysts",
          "singular": "Business Analyst",
          "label": "📈 Business Analyst",
          "emoji": 128200,
          "slug": "business-analyst",
          "similarTitles": [
            "business systems analyst",
            "process analyst",
            "requirements analyst"
          ],
          "relatedJobs": [
            "Data Analyst",
            "Project Manager",
            "Product Manager"
          ],
          "similarTitlesForMeta": [
            "business intelligence analyst",
            "business process analyst",
            "IT business analyst"
          ]
        },
        {
          "value": "Frontend Developer",
          "plural": "Frontend Developers",
          "singular": "Frontend Developer",
          "label": "🖥️ Frontend Developer",
          "emoji": 128421,
          "slug": "frontend-developer",
          "similarTitles": [
            "UI developer",
            "client-side developer",
            "web designer"
          ],
          "relatedJobs": [
            "Full-stack Developer",
            "UX Designer",
            "Web Designer"
          ],
          "similarTitlesForMeta": [
            "front-end engineer",
            "JavaScript developer",
            "React developer"
          ]
        },
        {
          "value": "Backend Developer",
          "plural": "Backend Developers",
          "singular": "Backend Developer",
          "label": "🗄️ Backend Developer",
          "emoji": 128451,
          "slug": "backend-developer",
          "similarTitles": [
            "server-side developer",
            "API developer",
            "database developer"
          ],
          "relatedJobs": [
            "Full-stack Developer",
            "DevOps Engineer",
            "Database Administrator"
          ],
          "similarTitlesForMeta": [
            "back-end engineer",
            "Python developer",
            "Node.js developer"
          ]
        },
        {
          "value": "Full-stack Developer",
          "plural": "Full-stack Developers",
          "singular": "Full-stack Developer",
          "label": "🏗️ Full-stack Developer",
          "emoji": 127959,
          "slug": "full-stack-developer",
          "similarTitles": [
            "full-stack engineer",
            "web developer",
            "software engineer"
          ],
          "relatedJobs": [
            "Frontend Developer",
            "Backend Developer",
            "DevOps Engineer"
          ],
          "similarTitlesForMeta": [
            "full-stack software engineer",
            "MEAN stack developer",
            "MERN stack developer"
          ]
        },
        {
          "value": "DevOps Engineer",
          "plural": "DevOps Engineers",
          "singular": "DevOps Engineer",
          "label": "🔄 DevOps Engineer",
          "emoji": 128260,
          "slug": "devops-engineer",
          "similarTitles": [
            "site reliability engineer",
            "systems engineer",
            "infrastructure engineer"
          ],
          "relatedJobs": [
            "Cloud Engineer",
            "System Administrator",
            "Backend Developer"
          ],
          "similarTitlesForMeta": [
            "DevOps specialist",
            "CI/CD engineer",
            "automation engineer"
          ]
        },
        {
          "value": "Data Analyst",
          "plural": "Data Analysts",
          "singular": "Data Analyst",
          "label": "📊 Data Analyst",
          "emoji": 128202,
          "slug": "data-analyst",
          "similarTitles": [
            "business intelligence analyst",
            "data specialist",
            "analytics consultant"
          ],
          "relatedJobs": [
            "Data Scientist",
            "Business Analyst",
            "Database Administrator"
          ],
          "similarTitlesForMeta": [
            "data insights analyst",
            "quantitative analyst",
            "marketing analyst"
          ]
        },
        {
          "value": "Graphic Designer",
          "plural": "Graphic Designers",
          "singular": "Graphic Designer",
          "label": "🎨 Graphic Designer",
          "emoji": 127912,
          "slug": "graphic-designer",
          "similarTitles": [
            "visual designer",
            "brand designer",
            "creative designer"
          ],
          "relatedJobs": [
            "UX Designer",
            "Web Designer",
            "Art Director"
          ],
          "similarTitlesForMeta": [
            "digital graphic designer",
            "print designer",
            "multimedia designer"
          ]
        },
        {
          "value": "Social Media Manager",
          "plural": "Social Media Managers",
          "singular": "Social Media Manager",
          "label": "📱 Social Media Manager",
          "emoji": 128241,
          "slug": "social-media-manager",
          "similarTitles": [
            "social media strategist",
            "community manager",
            "digital engagement specialist"
          ],
          "relatedJobs": [
            "Digital Marketing Manager",
            "Content Writer",
            "Brand Manager"
          ],
          "similarTitlesForMeta": [
            "social media coordinator",
            "social media marketing specialist",
            "social media content creator"
          ]
        },
        {
          "value": "SEO Specialist",
          "plural": "SEO Specialists",
          "singular": "SEO Specialist",
          "label": "🔍 SEO Specialist",
          "emoji": 128269,
          "slug": "seo-specialist",
          "similarTitles": [
            "search engine optimizer",
            "SEO analyst",
            "SEO consultant"
          ],
          "relatedJobs": [
            "Digital Marketing Manager",
            "Content Writer",
            "Web Analytics Specialist"
          ],
          "similarTitlesForMeta": [
            "SEO strategist",
            "organic search specialist",
            "SEO marketing manager"
          ]
        },
        {
          "value": "Technical Writer",
          "plural": "Technical Writers",
          "singular": "Technical Writer",
          "label": "📝 Technical Writer",
          "emoji": 128221,
          "slug": "technical-writer",
          "similarTitles": [
            "documentation specialist",
            "technical content writer",
            "API documentation writer"
          ],
          "relatedJobs": [
            "Content Writer",
            "UX Writer",
            "Knowledge Base Specialist"
          ],
          "similarTitlesForMeta": [
            "technical documentation specialist",
            "technical communicator",
            "instructional designer"
          ]
        },
        {
          "value": "Financial Analyst",
          "plural": "Financial Analysts",
          "singular": "Financial Analyst",
          "label": "💹 Financial Analyst",
          "emoji": 128185,
          "slug": "financial-analyst",
          "similarTitles": [
            "financial planner",
            "investment analyst",
            "budget analyst"
          ],
          "relatedJobs": [
            "Accountant",
            "Business Analyst",
            "Data Analyst"
          ],
          "similarTitlesForMeta": [
            "financial planning analyst",
            "corporate financial analyst",
            "financial reporting analyst"
          ]
        },
        {
          "value": "Human Resources Manager",
          "plural": "Human Resources Managers",
          "singular": "Human Resources Manager",
          "label": "👥 Human Resources Manager",
          "emoji": 128101,
          "slug": "human-resources-manager",
          "similarTitles": [
            "HR manager",
            "people operations manager",
            "talent management specialist"
          ],
          "relatedJobs": [
            "Recruiter",
            "Training and Development Specialist",
            "Compensation and Benefits Manager"
          ],
          "similarTitlesForMeta": [
            "HR business partner",
            "employee relations manager",
            "human capital manager"
          ]
        },
        {
          "value": "Sales Representative",
          "plural": "Sales Representatives",
          "singular": "Sales Representative",
          "label": "💼 Sales Representative",
          "emoji": 128188,
          "slug": "sales-representative",
          "similarTitles": [
            "account executive",
            "business development representative",
            "sales consultant"
          ],
          "relatedJobs": [
            "Account Manager",
            "Sales Manager",
            "Customer Success Manager"
          ],
          "similarTitlesForMeta": [
            "inside sales representative",
            "outside sales representative",
            "sales development representative"
          ]
        },
        {
          "value": "Virtual Assistant",
          "plural": "Virtual Assistants",
          "singular": "Virtual Assistant",
          "label": "🤖 Virtual Assistant",
          "emoji": 129302,
          "slug": "virtual-assistant",
          "similarTitles": [
            "remote executive assistant",
            "online personal assistant",
            "digital assistant"
          ],
          "relatedJobs": [
            "Administrative Assistant",
            "Project Coordinator",
            "Customer Support Representative"
          ],
          "similarTitlesForMeta": [
            "virtual office assistant",
            "remote administrative support",
            "online business assistant"
          ]
        },
        {
          "value": "Cybersecurity Analyst",
          "plural": "Cybersecurity Analysts",
          "singular": "Cybersecurity Analyst",
          "label": "🔒 Cybersecurity Analyst",
          "emoji": 128274,
          "slug": "cybersecurity-analyst",
          "similarTitles": [
            "information security analyst",
            "network security specialist",
            "IT security consultant"
          ],
          "relatedJobs": [
            "Security Engineer",
            "Network Administrator",
            "Risk Analyst"
          ],
          "similarTitlesForMeta": [
            "cyber threat analyst",
            "information assurance analyst",
            "security operations analyst"
          ]
        },
        {
          "value": "Cloud Architect",
          "plural": "Cloud Architects",
          "singular": "Cloud Architect",
          "label": "☁️ Cloud Architect",
          "emoji": 9729,
          "slug": "cloud-architect",
          "similarTitles": [
            "cloud solutions architect",
            "cloud infrastructure architect",
            "enterprise architect"
          ],
          "relatedJobs": [
            "DevOps Engineer",
            "Systems Engineer",
            "Network Engineer"
          ],
          "similarTitlesForMeta": [
            "AWS solutions architect",
            "Azure cloud architect",
            "Google Cloud architect"
          ]
        },
        {
          "value": "Data Engineer",
          "plural": "Data Engineers",
          "singular": "Data Engineer",
          "label": "🔧 Data Engineer",
          "emoji": 128295,
          "slug": "data-engineer",
          "similarTitles": [
            "big data engineer",
            "data infrastructure engineer",
            "ETL developer"
          ],
          "relatedJobs": [
            "Data Scientist",
            "Database Administrator",
            "Software Engineer"
          ],
          "similarTitlesForMeta": [
            "data pipeline engineer",
            "data warehouse engineer",
            "data integration specialist"
          ]
        },
        {
          "value": "UI Designer",
          "plural": "UI Designers",
          "singular": "UI Designer",
          "label": "🖌️ UI Designer",
          "emoji": 128396,
          "slug": "ui-designer",
          "similarTitles": [
            "user interface designer",
            "visual designer",
            "interface architect"
          ],
          "relatedJobs": [
            "UX Designer",
            "Graphic Designer",
            "Web Designer"
          ],
          "similarTitlesForMeta": [
            "UI/UX designer",
            "digital product designer",
            "interaction designer"
          ]
        },
        {
          "value": "Content Marketing Manager",
          "plural": "Content Marketing Managers",
          "singular": "Content Marketing Manager",
          "label": "📰 Content Marketing Manager",
          "emoji": 128240,
          "slug": "content-marketing-manager",
          "similarTitles": [
            "content strategist",
            "brand journalist",
            "content director"
          ],
          "relatedJobs": [
            "Digital Marketing Manager",
            "Content Writer",
            "SEO Specialist"
          ],
          "similarTitlesForMeta": [
            "content marketing strategist",
            "digital content manager",
            "editorial manager"
          ]
        },
        {
          "value": "Quality Assurance Tester",
          "plural": "Quality Assurance Testers",
          "singular": "Quality Assurance Tester",
          "label": "🐛 Quality Assurance Tester",
          "emoji": 128027,
          "slug": "quality-assurance-tester",
          "similarTitles": [
            "QA analyst",
            "software tester",
            "test engineer"
          ],
          "relatedJobs": [
            "Software Developer",
            "Test Automation Engineer",
            "DevOps Engineer"
          ],
          "similarTitlesForMeta": [
            "QA engineer",
            "quality control specialist",
            "software quality assurance analyst"
          ]
        },
        {
          "value": "Technical Support Specialist",
          "plural": "Technical Support Specialists",
          "singular": "Technical Support Specialist",
          "label": "🛠️ Technical Support Specialist",
          "emoji": 128736,
          "slug": "technical-support-specialist",
          "similarTitles": [
            "IT support specialist",
            "help desk technician",
            "technical support engineer"
          ],
          "relatedJobs": [
            "Customer Support Representative",
            "System Administrator",
            "Network Administrator"
          ],
          "similarTitlesForMeta": [
            "IT support technician",
            "desktop support specialist",
            "technical customer service representative"
          ]
        },
        {
          "value": "E-commerce Manager",
          "plural": "E-commerce Managers",
          "singular": "E-commerce Manager",
          "label": "🛒 E-commerce Manager",
          "emoji": 128722,
          "slug": "ecommerce-manager",
          "similarTitles": [
            "online store manager",
            "digital retail manager",
            "e-commerce operations manager"
          ],
          "relatedJobs": [
            "Digital Marketing Manager",
            "Product Manager",
            "Sales Manager"
          ],
          "similarTitlesForMeta": [
            "e-commerce director",
            "online marketplace manager",
            "e-commerce business analyst"
          ]
        },
        {
          "value": "Blockchain Developer",
          "plural": "Blockchain Developers",
          "singular": "Blockchain Developer",
          "label": "🔗 Blockchain Developer",
          "emoji": 128279,
          "slug": "blockchain-developer",
          "similarTitles": [
            "smart contract developer",
            "cryptocurrency engineer",
            "distributed ledger developer"
          ],
          "relatedJobs": [
            "Software Engineer",
            "Cryptographer",
            "Security Engineer"
          ],
          "similarTitlesForMeta": [
            "blockchain solutions architect",
            "DApp developer",
            "blockchain protocol engineer"
          ]
        },
        {
          "value": "Video Editor",
          "plural": "Video Editors",
          "singular": "Video Editor",
          "label": "🎬 Video Editor",
          "emoji": 127909,
          "slug": "video-editor",
          "similarTitles": [
            "film editor",
            "post-production specialist",
            "multimedia editor"
          ],
          "relatedJobs": [
            "Motion Graphics Designer",
            "Content Creator",
            "Videographer"
          ],
          "similarTitlesForMeta": [
            "video post-production editor",
            "digital video editor",
            "YouTube video editor"
          ]
        },
        {
          "value": "Translator",
          "plural": "Translators",
          "singular": "Translator",
          "label": "🌐 Translator",
          "emoji": 127760,
          "slug": "translator",
          "similarTitles": [
            "interpreter",
            "localization specialist",
            "linguistic specialist"
          ],
          "relatedJobs": [
            "Content Writer",
            "Proofreader",
            "Localization Manager"
          ],
          "similarTitlesForMeta": [
            "multilingual translator",
            "technical translator",
            "literary translator"
          ]
        },
        {
          "value": "Customer Success Manager",
          "plural": "Customer Success Managers",
          "singular": "Customer Success Manager",
          "label": "🤝 Customer Success Manager",
          "emoji": 129309,
          "slug": "customer-success-manager",
          "similarTitles": [
            "client relationship manager",
            "account manager",
            "customer experience manager"
          ],
          "relatedJobs": [
            "Account Executive",
            "Customer Support Representative",
            "Sales Manager"
          ],
          "similarTitlesForMeta": [
            "customer success specialist",
            "client success manager",
            "customer retention manager"
          ]
        },
        {
          "value": "Scrum Master",
          "plural": "Scrum Masters",
          "singular": "Scrum Master",
          "label": "🏃 Scrum Master",
          "emoji": 127939,
          "slug": "scrum-master",
          "similarTitles": [
            "agile coach",
            "agile project manager",
            "iteration manager"
          ],
          "relatedJobs": [
            "Project Manager",
            "Product Owner",
            "Agile Coach"
          ],
          "similarTitlesForMeta": [
            "agile scrum master",
            "scrum coach",
            "agile delivery manager"
          ]
        },
        {
          "value": "Copywriter",
          "plural": "Copywriters",
          "singular": "Copywriter",
          "label": "✍️ Copywriter",
          "emoji": 9997,
          "slug": "copywriter",
          "similarTitles": [
            "advertising copywriter",
            "creative writer",
            "content creator"
          ],
          "relatedJobs": [
            "Content Writer",
            "Marketing Specialist",
            "Brand Strategist"
          ],
          "similarTitlesForMeta": [
            "digital copywriter",
            "SEO copywriter",
            "marketing copywriter"
          ]
        },
        {
          "value": "Business Intelligence Analyst",
          "plural": "Business Intelligence Analysts",
          "singular": "Business Intelligence Analyst",
          "label": "📊 Business Intelligence Analyst",
          "emoji": 128202,
          "slug": "business-intelligence-analyst",
          "similarTitles": [
            "BI developer",
            "data visualization specialist",
            "analytics consultant"
          ],
          "relatedJobs": [
            "Data Analyst",
            "Business Analyst",
            "Data Scientist"
          ],
          "similarTitlesForMeta": [
            "BI reporting analyst",
            "data insights analyst",
            "business analytics specialist"
          ]
        },
        {
          "value": "Network Engineer",
          "plural": "Network Engineers",
          "singular": "Network Engineer",
          "label": "🌐 Network Engineer",
          "emoji": 127760,
          "slug": "network-engineer",
          "similarTitles": [
            "network administrator",
            "network architect",
            "infrastructure engineer"
          ],
          "relatedJobs": [
            "Systems Administrator",
            "Cloud Engineer",
            "IT Support Specialist"
          ],
          "similarTitlesForMeta": [
            "network systems engineer",
            "network security engineer",
            "network operations engineer"
          ]
        },
        {
          "value": "Mobile App Developer",
          "plural": "Mobile App Developers",
          "singular": "Mobile App Developer",
          "label": "📱 Mobile App Developer",
          "emoji": 128241,
          "slug": "mobile-app-developer",
          "similarTitles": [
            "iOS developer",
            "Android developer",
            "mobile software engineer"
          ],
          "relatedJobs": [
            "Frontend Developer",
            "UI/UX Designer",
            "Full-stack Developer"
          ],
          "similarTitlesForMeta": [
            "mobile application programmer",
            "cross-platform mobile developer",
            "React Native developer"
          ]
        },
        {
          "value": "Machine Learning Engineer",
          "plural": "Machine Learning Engineers",
          "singular": "Machine Learning Engineer",
          "label": "🤖 Machine Learning Engineer",
          "emoji": 129302,
          "slug": "machine-learning-engineer",
          "similarTitles": [
            "AI engineer",
            "deep learning specialist",
            "ML researcher"
          ],
          "relatedJobs": [
            "Data Scientist",
            "Software Engineer",
            "Research Scientist"
          ],
          "similarTitlesForMeta": [
            "ML ops engineer",
            "AI/ML engineer",
            "machine learning researcher"
          ]
        },
        {
          "value": "Technical Recruiter",
          "plural": "Technical Recruiters",
          "singular": "Technical Recruiter",
          "label": "🔍 Technical Recruiter",
          "emoji": 128269,
          "slug": "technical-recruiter",
          "similarTitles": [
            "IT recruiter",
            "talent acquisition specialist",
            "engineering recruiter"
          ],
          "relatedJobs": [
            "HR Manager",
            "Talent Sourcer",
            "Hiring Manager"
          ],
          "similarTitlesForMeta": [
            "tech talent acquisition specialist",
            "IT staffing specialist",
            "technical sourcer"
          ]
        },
        {
          "value": "Growth Hacker",
          "plural": "Growth Hackers",
          "singular": "Growth Hacker",
          "label": "📈 Growth Hacker",
          "emoji": 128200,
          "slug": "growth-hacker",
          "similarTitles": [
            "growth marketer",
            "growth strategist",
            "digital growth specialist"
          ],
          "relatedJobs": [
            "Digital Marketing Manager",
            "Product Manager",
            "Data Analyst"
          ],
          "similarTitlesForMeta": [
            "growth marketing manager",
            "user acquisition specialist",
            "conversion rate optimizer"
          ]
        },
        {
          "value": "Information Security Analyst",
          "plural": "Information Security Analysts",
          "singular": "Information Security Analyst",
          "label": "🔐 Information Security Analyst",
          "emoji": 128274,
          "slug": "information-security-analyst",
          "similarTitles": [
            "cybersecurity analyst",
            "IT security specialist",
            "information assurance analyst"
          ],
          "relatedJobs": [
            "Network Security Engineer",
            "Security Architect",
            "Penetration Tester"
          ],
          "similarTitlesForMeta": [
            "infosec analyst",
            "cyber threat analyst",
            "security operations analyst"
          ]
        },
        {
          "value": "Technical Account Manager",
          "plural": "Technical Account Managers",
          "singular": "Technical Account Manager",
          "label": "🤝 Technical Account Manager",
          "emoji": 129309,
          "slug": "technical-account-manager",
          "similarTitles": [
            "customer success engineer",
            "technical client manager",
            "solutions consultant"
          ],
          "relatedJobs": [
            "Account Manager",
            "Customer Success Manager",
            "Sales Engineer"
          ],
          "similarTitlesForMeta": [
            "technical relationship manager",
            "technical customer success manager",
            "client solutions manager"
          ]
        },
        {
          "value": "Instructional Designer",
          "plural": "Instructional Designers",
          "singular": "Instructional Designer",
          "label": "📚 Instructional Designer",
          "emoji": 128218,
          "slug": "instructional-designer",
          "similarTitles": [
            "e-learning specialist",
            "learning experience designer",
            "curriculum developer"
          ],
          "relatedJobs": [
            "Training Specialist",
            "Educational Content Creator",
            "UX Designer"
          ],
          "similarTitlesForMeta": [
            "online course designer",
            "learning solutions architect",
            "educational technologist"
          ]
        },
        {
          "value": "3D Artist",
          "plural": "3D Artists",
          "singular": "3D Artist",
          "label": "🎨 3D Artist",
          "emoji": 127912,
          "slug": "3d-artist",
          "similarTitles": [
            "3D modeler",
            "CGI artist",
            "3D animator"
          ],
          "relatedJobs": [
            "Graphic Designer",
            "Game Developer",
            "VFX Artist"
          ],
          "similarTitlesForMeta": [
            "3D visualization artist",
            "character artist",
            "environment artist"
          ]
        },
        {
          "value": "Affiliate Marketing Manager",
          "plural": "Affiliate Marketing Managers",
          "singular": "Affiliate Marketing Manager",
          "label": "🤝 Affiliate Marketing Manager",
          "emoji": 129309,
          "slug": "affiliate-marketing-manager",
          "similarTitles": [
            "partnership manager",
            "affiliate program manager",
            "performance marketing manager"
          ],
          "relatedJobs": [
            "Digital Marketing Manager",
            "Business Development Manager",
            "Sales Manager"
          ],
          "similarTitlesForMeta": [
            "affiliate relations manager",
            "partner marketing manager",
            "affiliate network manager"
          ]
        },
        {
          "value": "UX Researcher",
          "plural": "UX Researchers",
          "singular": "UX Researcher",
          "label": "🔍 UX Researcher",
          "emoji": 128269,
          "slug": "ux-researcher",
          "similarTitles": [
            "user researcher",
            "usability specialist",
            "design researcher"
          ],
          "relatedJobs": [
            "UX Designer",
            "Product Manager",
            "Market Research Analyst"
          ],
          "similarTitlesForMeta": [
            "user experience researcher",
            "human factors researcher",
            "behavioral researcher"
          ]
        },
        {
          "value": "Penetration Tester",
          "plural": "Penetration Testers",
          "singular": "Penetration Tester",
          "label": "🕵️ Penetration Tester",
          "emoji": 128373,
          "slug": "penetration-tester",
          "similarTitles": [
            "ethical hacker",
            "security consultant",
            "red team specialist"
          ],
          "relatedJobs": [
            "Information Security Analyst",
            "Cybersecurity Engineer",
            "Network Security Specialist"
          ],
          "similarTitlesForMeta": [
            "offensive security engineer",
            "vulnerability assessment specialist",
            "security auditor"
          ]
        }
  ];
