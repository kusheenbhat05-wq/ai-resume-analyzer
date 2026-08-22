/* =========================================
   RESUME AI — ANALYZER LOGIC
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const resumeText = document.getElementById("resumeText");
    const jobText = document.getElementById("jobText");

    const resumeCount = document.getElementById("resumeCount");
    const jobCount = document.getElementById("jobCount");

    const analyzeBtn = document.getElementById("analyzeBtn");
    const results = document.getElementById("results");

    const score = document.getElementById("score");
    const scoreMessage = document.getElementById("scoreMessage");
    const scoreDescription = document.getElementById("scoreDescription");

    const matchingSkills =
        document.getElementById("matchingSkills");

    const missingSkills =
        document.getElementById("missingSkills");

    const keywords =
        document.getElementById("keywords");

    const suggestions =
        document.getElementById("suggestions");


    /* =========================================
       CHARACTER COUNTERS
    ========================================= */

    resumeText.addEventListener("input", () => {

        const count = resumeText.value.length;

        resumeCount.textContent =
            `${count} characters`;

    });


    jobText.addEventListener("input", () => {

        const count = jobText.value.length;

        jobCount.textContent =
            `${count} characters`;

    });


    /* =========================================
       SKILLS DATABASE
    ========================================= */

    const skills = [

        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "React.js",
        "Node.js",
        "Express",
        "Python",
        "Java",
        "C++",
        "C",
        "SQL",
        "MySQL",
        "MongoDB",
        "Git",
        "GitHub",
        "REST API",
        "API",
        "TypeScript",
        "Next.js",
        "Tailwind",
        "Bootstrap",

        "Data Structures",
        "Algorithms",
        "DSA",
        "Problem Solving",

        "Machine Learning",
        "Artificial Intelligence",
        "AI",

        "UI/UX",
        "Figma",
        "Responsive Design",

        "Docker",
        "AWS",
        "Azure",
        "Firebase",

        "Communication",
        "Leadership",
        "Teamwork",
        "Project Management"

    ];


    /* =========================================
       CLEAN TEXT
    ========================================= */

    function cleanText(text) {

        return text
            .toLowerCase()
            .replace(/[^\w\s.#/+]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    /* =========================================
       FIND SKILLS
    ========================================= */

    function findSkills(text) {

        const clean = cleanText(text);

        return skills.filter(skill => {

            const skillText =
                skill.toLowerCase();

            return clean.includes(skillText);

        });

    }


    /* =========================================
       IMPORTANT KEYWORDS
    ========================================= */

    function findKeywords(text) {

        const clean = cleanText(text);

        const words =
            clean.split(" ");

        const stopWords = new Set([

            "the",
            "and",
            "for",
            "with",
            "that",
            "this",
            "from",
            "your",
            "you",
            "are",
            "our",
            "will",
            "have",
            "has",
            "job",
            "work",
            "role",
            "team",
            "using",
            "into",
            "their",
            "they",
            "about",
            "experience",
            "looking",
            "required",
            "should",
            "would",
            "can",
            "able",
            "who",
            "what",
            "where",
            "when",
            "how"

        ]);

        const frequency = {};

        words.forEach(word => {

            if (
                word.length >= 5 &&
                !stopWords.has(word)
            ) {

                frequency[word] =
                    (frequency[word] || 0) + 1;

            }

        });


        return Object.entries(frequency)

            .sort((a, b) => b[1] - a[1])

            .slice(0, 12)

            .map(item => item[0]);

    }


    /* =========================================
       DISPLAY SKILLS
    ========================================= */

    function displaySkills(container, list) {

        container.innerHTML = "";


        if (list.length === 0) {

            const empty =
                document.createElement("span");

            empty.textContent =
                "No skills detected";

            container.appendChild(empty);

            return;

        }


        list.forEach(skill => {

            const tag =
                document.createElement("span");

            tag.textContent = skill;

            container.appendChild(tag);

        });

    }


    /* =========================================
       DISPLAY KEYWORDS
    ========================================= */

    function displayKeywords(list) {

        keywords.innerHTML = "";


        if (list.length === 0) {

            keywords.innerHTML =
                "<span>No keywords detected</span>";

            return;

        }


        list.forEach(keyword => {

            const tag =
                document.createElement("span");

            tag.textContent = keyword;

            keywords.appendChild(tag);

        });

    }


    /* =========================================
       GENERATE SUGGESTIONS
    ========================================= */

    function generateSuggestions(
        matching,
        missing,
        resume
    ) {

        const suggestionsList = [];


        if (missing.length > 0) {

            suggestionsList.push(
                `Consider highlighting relevant skills such as ${missing.slice(0, 4).join(", ")} if you genuinely have experience with them.`
            );

        }


        if (resume.length < 500) {

            suggestionsList.push(
                "Your resume text appears quite short. Add relevant projects, experience, technical skills and measurable contributions."
            );

        }


        if (!resume.includes("project")) {

            suggestionsList.push(
                "Consider adding a dedicated Projects section with technologies and a short description of your contribution."
            );

        }


        if (!resume.includes("github")) {

            suggestionsList.push(
                "Add your GitHub profile if you have public projects that demonstrate your technical skills."
            );

        }


        if (!resume.includes("experience")) {

            suggestionsList.push(
                "Highlight internship, academic or practical experience relevant to the target role."
            );

        }


        if (suggestionsList.length === 0) {

            suggestionsList.push(
                "Your resume covers the detected requirements well. Focus on measurable achievements and tailoring your summary to the specific role."
            );

        }


        suggestions.innerHTML = "";


        suggestionsList
            .slice(0, 5)
            .forEach(text => {

                const li =
                    document.createElement("li");

                li.textContent = text;

                suggestions.appendChild(li);

            });

    }


    /* =========================================
       SCORE MESSAGE
    ========================================= */

    function getScoreMessage(value) {

        if (value >= 85) {

            return {
                title: "Excellent match",
                description:
                    "Your profile aligns strongly with the detected requirements."
            };

        }

        if (value >= 70) {

            return {
                title: "Strong match",
                description:
                    "You match many of the important requirements for this role."
            };

        }

        if (value >= 50) {

            return {
                title: "Moderate match",
                description:
                    "Your profile has relevant skills, but there are some noticeable gaps."
            };

        }

        return {
            title: "Needs improvement",
            description:
                "Several important requirements appear to be missing from your resume."
        };

    }


    /* =========================================
       ANALYZE RESUME
    ========================================= */

    analyzeBtn.addEventListener("click", () => {

        const resume =
            resumeText.value.trim();

        const job =
            jobText.value.trim();


        /* VALIDATION */

        if (!resume || !job) {

            alert(
                "Please paste both your resume and the job description before analyzing."
            );

            return;

        }


        /* FIND SKILLS */

        const resumeSkills =
            findSkills(resume);

        const jobSkills =
            findSkills(job);


        const matching =
            jobSkills.filter(skill =>
                resumeSkills
                    .map(item => item.toLowerCase())
                    .includes(skill.toLowerCase())
            );


        const missing =
            jobSkills.filter(skill =>
                !resumeSkills
                    .map(item => item.toLowerCase())
                    .includes(skill.toLowerCase())
            );


        /* SCORE */

        let skillScore = 0;


        if (jobSkills.length > 0) {

            skillScore =
                (matching.length / jobSkills.length) * 100;

        }


        const jobWords =
            new Set(
                cleanText(job)
                    .split(" ")
                    .filter(word => word.length > 4)
            );


        const resumeWords =
            new Set(
                cleanText(resume)
                    .split(" ")
            );


        let wordMatches = 0;


        jobWords.forEach(word => {

            if (resumeWords.has(word)) {

                wordMatches++;

            }

        });


        const keywordScore =
            jobWords.size > 0
                ? (wordMatches / jobWords.size) * 100
                : 0;


        let finalScore =
            Math.round(
                (skillScore * 0.7) +
                (keywordScore * 0.3)
            );


        finalScore =
            Math.min(100, Math.max(0, finalScore));


        /* RESULTS */

        score.textContent =
            `${finalScore}%`;


        const message =
            getScoreMessage(finalScore);


        scoreMessage.textContent =
            message.title;


        scoreDescription.textContent =
            message.description;


        displaySkills(
            matchingSkills,
            matching
        );


        displaySkills(
            missingSkills,
            missing
        );


        displayKeywords(
            findKeywords(job)
        );


        generateSuggestions(
            matching,
            missing,
            cleanText(resume)
        );


        /* SHOW RESULTS */

        results.classList.remove("hidden");


        setTimeout(() => {

            results.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 150);


    });


});
