
export type QuestionType = "text" | "number" | "select" | "radio" | "scale";

export interface Question {
    id: string;
    label: string;
    type: QuestionType;
    options?: string[];
    conditional?: {
        field: string;
        value: string;
    };
}

export interface Section {
    sectionTitle: string;
    description?: string;
    scale?: string[];
    questions: Question[];
}

export const QUESTIONS_DATA: Section[] = [
    {
        sectionTitle: "Demographics",
        questions: [
            {
                id: "member_status_check",
                label: "Are you a member of the Church of Jesus Christ of Latter-day Saints?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "age_group",
                label: "Age group",
                type: "select",
                options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
            },
            {
                id: "gender",
                label: "Gender",
                type: "select",
                options: ["Male", "Female", "Non-binary/Other"],
            },
            {
                id: "political_affiliation",
                label: "Political affiliation",
                type: "select",
                options: [
                    "Very conservative",
                    "Somewhat conservative",
                    "Moderate/Independent",
                    "Somewhat liberal",
                    "Very liberal",
                ],
            },
            {
                id: "marital_status",
                label: "Marital status",
                type: "select",
                options: ["Single, never married", "Married", "Divorced", "Widowed"],
            },
            {
                id: "has_children",
                label: "Do you have children?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "number_of_children",
                label: "If yes, how many children do you have?",
                type: "number",
                conditional: { field: "has_children", value: "Yes" },
            },
            {
                id: "member_status",
                label: "Member status",
                type: "select",
                options: [
                    "Lifelong member (raised in the Church)",
                    "Convert (joined as adult)",
                    "Convert (joined as child/teen)",
                ],
            },
            {
                id: "served_mission",
                label: "Did you serve a full-time mission?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "church_activity_level",
                label: "Current level of Church activity",
                type: "select",
                options: [
                    "Attend weekly",
                    "Attend monthly",
                    "Attend occasionally (holidays, special events)",
                    "Inactive, but still identify as LDS",
                ],
            },
            {
                id: "geographic_region",
                label: "Where do you currently live?",
                type: "select",
                options: [
                    "Utah",
                    "Western US (excluding Utah)",
                    "Eastern US",
                    "Outside of US",
                ],
            },
            {
                id: "education_level",
                label: "Highest education level completed",
                type: "select",
                options: [
                    "High school or less",
                    "Some college",
                    "Bachelor's degree",
                    "Graduate/Professional degree",
                ],
            },
            {
                id: "calling_type",
                label: "Type of current calling (if applicable)",
                type: "select",
                options: [
                    "Bishopric/Stake Presidency/High Council",
                    "Relief Society/Elders Quorum Presidency",
                    "Young Women/Young Men leadership",
                    "Primary leadership",
                    "Teacher (Sunday School, Primary, seminary, etc.)",
                    "Service/Activity oriented",
                    "Clerk/Assistant",
                    "Nursery",
                    "No current calling",
                ],
            },
        ],
    },
    {
        sectionTitle: "Frequency of Religious Practices",
        description: "How often do you engage in the following activities?",
        scale: ["Never", "A few times a year or less", "Once or twice a month", "Once a week", "More than once a week"],
        questions: [
            { id: "freq_pray", label: "Pray personally (outside of church meetings)", type: "scale" },
            { id: "freq_second_hour", label: "Attend second hour of church (Sunday School/RS/EQ)", type: "scale" },
            { id: "freq_come_follow_me", label: "Use Come, Follow Me curriculum for personal/family study", type: "scale" },
            { id: "freq_calling", label: "Participate in your current calling", type: "scale" },
            { id: "freq_family_history", label: "Do family history work", type: "scale" },
            { id: "freq_scripture_study", label: "Engage in personal scripture study", type: "scale" },
            {
                id: "freq_temple",
                label: "Attend the temple",
                type: "scale",
                options: ["Never", "A few times a year or less", "Once or twice a month", "Once a week", "More than once a week", "N/A - Don't participate"]
            },
        ],
    },
    {
        sectionTitle: "Scripture Reading Frequency",
        description: "How often do you read from each of the following?",
        scale: ["Never", "A few times a year", "Monthly", "Weekly", "Daily"],
        questions: [
            { id: "freq_bom", label: "The Book of Mormon", type: "scale" },
            { id: "freq_dc", label: "The Doctrine & Covenants", type: "scale" },
            { id: "freq_pgp", label: "The Pearl of Great Price", type: "scale" },
            { id: "freq_ot", label: "The Old Testament", type: "scale" },
            { id: "freq_nt", label: "The New Testament", type: "scale" },
        ],
    },
    {
        sectionTitle: "Satisfaction with Religious Practices",
        description: "How satisfied are you with your experience of the following?",
        scale: ["Very Dissatisfied", "Dissatisfied", "Neither Satisfied nor Dissatisfied", "Satisfied", "Very Satisfied", "N/A (Don't participate)"],
        questions: [
            { id: "sat_prayer", label: "Your prayer life", type: "scale" },
            { id: "sat_second_hour", label: "Second hour classes", type: "scale" },
            { id: "sat_come_follow_me", label: "Come, Follow Me curriculum", type: "scale" },
            { id: "sat_calling", label: "Your current calling", type: "scale" },
            { id: "sat_family_history", label: "Family history work", type: "scale" },
            { id: "sat_scripture_study", label: "Scripture study", type: "scale" },
            { id: "sat_temple", label: "Temple worship overall", type: "scale" },
        ],
    },
    {
        sectionTitle: "Doctrinal Beliefs",
        description: "Please indicate your level of agreement with the following statements.",
        scale: ["Strongly Disagree", "Disagree", "Neutral/Unsure", "Agree", "Strongly Agree"],
        questions: [
            {
                id: "belief_priesthood_ban_inspired",
                label: "The priesthood ban which restricted Black members' access to the priesthood and temple blessings until 1978 was inspired by God",
                type: "scale"
            },
            { id: "belief_gender_eternal", label: "Gender is an eternal characteristic", type: "scale" },
            { id: "belief_sexual_relations_married_only", label: "Sexual relations are only appropriate between a man and woman who are legally married", type: "scale" },
            { id: "belief_children_born_in_matrimony", label: "Children are entitled to birth within the bonds of matrimony between a husband and wife", type: "scale" },
            { id: "belief_happiness_through_christ", label: "Happiness in family life is most likely to be achieved when founded upon the teachings of Jesus Christ", type: "scale" },
            { id: "belief_proclamation_inspired", label: "The family proclamation was revealed/inspired by God", type: "scale" },
            { id: "belief_abortion_church_position", label: "I agree with the Church's official position on abortion (as stated in General Handbook 38.6.1)", type: "scale" },
            { id: "belief_tithing_commandment", label: "Tithing is a commandment from God", type: "scale" },
            { id: "belief_wow_alcohol", label: "The Word of Wisdom prohibits alcohol", type: "scale" },
            { id: "belief_wow_vaping", label: "The Word of Wisdom prohibits vaping", type: "scale" },
            { id: "belief_wow_marijuana", label: "The Word of Wisdom prohibits recreational marijuana", type: "scale" },
            { id: "belief_wow_coffee", label: "The Word of Wisdom prohibits coffee", type: "scale" },
            { id: "belief_wow_tea", label: "The Word of Wisdom prohibits tea", type: "scale" },
            { id: "belief_wow_caffeine", label: "The Word of Wisdom prohibits caffeine", type: "scale" },
            { id: "belief_bom_literal_history", label: "The Book of Mormon is a literal historical record", type: "scale" },
            { id: "belief_ordinances_essential", label: "The ordinances I've received are essential for my salvation", type: "scale" },
            { id: "belief_prophets_can_err", label: "Prophets and apostles can speak as men and make mistakes in their teaching", type: "scale" },
            { id: "belief_revelation_allows_change", label: "Continued revelation means Church policies and doctrines can change over time", type: "scale" },
            { id: "belief_women_priesthood", label: "Women should be able to be ordained to a priesthood office", type: "scale" },
            { id: "belief_lgbtq_faithful_relationships", label: "LGBTQ+ individuals can be faithful members while in same-sex relationships", type: "scale" },
            { id: "belief_progression_between_kingdoms", label: "It is possible for individuals to progress between kingdoms of glory in the eternities", type: "scale" },
        ],
    },
    {
        sectionTitle: "Lifestyle & Practices",
        description: "Please indicate how frequently you engage in the following behaviors or how acceptable you find them.",
        questions: [
            {
                id: "lifestyle_play_video_games",
                label: "How often do you play video games?",
                type: "scale",
                options: ["Never", "Rarely (A few times a year)", "Sometimes (Monthly)", "Often (Weekly)", "Very Often (Daily or almost daily)"]
            },
            {
                id: "lifestyle_watch_r_movies",
                label: "How often do you watch R-rated movies?",
                type: "scale",
                options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
            },
            {
                id: "lifestyle_multiple_piercings_ok",
                label: "How acceptable do you find multiple ear piercings for Latter-day Saints?",
                type: "scale",
                options: ["Completely Unacceptable", "Somewhat Unacceptable", "Neutral", "Somewhat Acceptable", "Completely Acceptable"]
            },
            {
                id: "lifestyle_tattoos_ok",
                label: "How acceptable do you find tattoos for Latter-day Saints?",
                type: "scale",
                options: ["Completely Unacceptable", "Somewhat Unacceptable", "Neutral", "Somewhat Acceptable", "Completely Acceptable"]
            },
            {
                id: "lifestyle_homeschooling",
                label: "Would you consider homeschooling your children (or have you homeschooled them)?",
                type: "radio",
                options: ["Yes", "No", "Maybe"]
            },
            {
                id: "lifestyle_holistic_preference",
                label: "I believe holistic/natural remedies are often more effective than conventional medicine",
                type: "scale",
                options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
            {
                id: "lifestyle_mental_health_meds_ok",
                label: "How acceptable do you find mental health medication?",
                type: "scale",
                options: ["Completely Unacceptable", "Somewhat Unacceptable", "Neutral", "Somewhat Acceptable", "Completely Acceptable"]
            },
            {
                id: "lifestyle_vasectomy_ok",
                label: "How acceptable do you find vasectomies/tubal ligations as forms of family planning?",
                type: "scale",
                options: ["Completely Unacceptable", "Somewhat Unacceptable", "Neutral", "Somewhat Acceptable", "Completely Acceptable"]
            },
            {
                id: "lifestyle_birth_control_ok",
                label: "How acceptable do you find birth control within marriage?",
                type: "scale",
                options: ["Completely Unacceptable", "Somewhat Unacceptable", "Neutral", "Somewhat Acceptable", "Completely Acceptable"]
            },
            {
                id: "lifestyle_support_no_baptism_age_8",
                label: "If your child decided not to be baptized at age 8, how would you respond?",
                type: "scale",
                options: ["Strongly Oppose", "Somewhat Oppose", "Neutral", "Somewhat Support", "Fully Support"]
            },
            {
                id: "lifestyle_mothers_stay_home",
                label: "To what extent do you agree: Mothers of young children should primarily stay home rather than work outside the home?",
                type: "scale",
                options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
            },
        ],
    },
    {
        sectionTitle: "Social Connections",
        description: "Please indicate your level of agreement.",
        scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        questions: [
            { id: "social_enjoy_ward", label: "I enjoy my ward/branch community", type: "scale" },
            { id: "social_friends_lds", label: "Most of my close friends are Latter-day Saints", type: "scale" },
            { id: "social_friends_non_lds", label: "I have meaningful friendships with people who are not LDS", type: "scale" },
            {
                id: "social_mission_enjoy",
                label: "I enjoyed my mission experience",
                type: "scale",
                options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree", "N/A - Did not serve"]
            },
            { id: "social_children_friends", label: "I want my children to primarily have Latter-day Saint friends", type: "scale" },
            { id: "social_left_church_touch", label: "I keep in touch with friends or family who have left the Church", type: "scale" },
            { id: "social_respect_leave", label: "I respect those who choose to leave the Church", type: "scale" },
        ],
    },
    {
        sectionTitle: "Political & Theological Alignment",
        description: "Please indicate your level of agreement.",
        scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        questions: [
            { id: "align_conservative", label: "The gospel aligns most closely with conservative political values", type: "scale" },
            { id: "align_liberal", label: "The gospel aligns most closely with liberal political values", type: "scale" },
        ],
    },
    {
        sectionTitle: "Institutional Attitudes",
        description: "Please indicate your level of agreement.",
        scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        questions: [
            { id: "church_discipline", label: "I agree with how the Church handles disciplinary councils/membership restrictions", type: "scale" },
            { id: "transparency_history", label: "The Church should be more transparent about its history", type: "scale" },
            { id: "transparency_finances", label: "The Church should be more transparent about its finances", type: "scale" },
            { id: "child_marry_non_lds", label: "I would feel comfortable with my child marrying someone who is not LDS", type: "scale" },
        ],
    },

];
