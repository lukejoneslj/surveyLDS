
import * as z from "zod";

const requiredString = z.string().min(1, { message: "Please select an option" });

export const surveySchema = z.object({
    // Demographics
    member_status_check: z.enum(["Yes", "No"] as const, {
        message: "Please select if you are a member.",
    }),
    age_group: requiredString,
    gender: requiredString,
    political_affiliation: requiredString,
    marital_status: requiredString,
    has_children: requiredString,
    number_of_children: z.union([z.string(), z.number()]).optional(), // Still optional logic-wise, handled by conditional
    member_status: requiredString,
    served_mission: requiredString,
    church_activity_level: requiredString,
    geographic_region: requiredString,
    education_level: requiredString,
    calling_type: requiredString,

    // Section 2A: Frequency of Religious Practices
    freq_pray: requiredString,
    freq_second_hour: requiredString,
    freq_come_follow_me: requiredString,
    freq_calling: requiredString,
    freq_family_history: requiredString,
    freq_scripture_study: requiredString,
    freq_temple: requiredString,

    // Section 2B: Scripture Reading Frequency
    freq_bom: requiredString,
    freq_dc: requiredString,
    freq_pgp: requiredString,
    freq_ot: requiredString,
    freq_nt: requiredString,

    // Section 2C: Satisfaction
    sat_prayer: requiredString,
    sat_second_hour: requiredString,
    sat_come_follow_me: requiredString,
    sat_calling: requiredString,
    sat_family_history: requiredString,
    sat_scripture_study: requiredString,
    sat_temple: requiredString,

    // Section 3: Doctrinal Beliefs
    belief_priesthood_ban_inspired: requiredString,
    belief_gender_eternal: requiredString,
    belief_sexual_relations_married_only: requiredString,
    belief_children_born_in_matrimony: requiredString,
    belief_happiness_through_christ: requiredString,
    belief_proclamation_inspired: requiredString,
    belief_abortion_church_position: requiredString,
    belief_tithing_commandment: requiredString,
    belief_wow_alcohol: requiredString,
    belief_wow_vaping: requiredString,
    belief_wow_marijuana: requiredString,
    belief_wow_coffee: requiredString,
    belief_wow_tea: requiredString,
    belief_wow_caffeine: requiredString,
    belief_bom_literal_history: requiredString,
    belief_ordinances_essential: requiredString,
    belief_prophets_can_err: requiredString,
    belief_revelation_allows_change: requiredString,
    belief_women_priesthood: requiredString,
    belief_lgbtq_faithful_relationships: requiredString,
    belief_progression_between_kingdoms: requiredString,

    // Section 4: Lifestyle & Practices
    lifestyle_play_video_games: requiredString,
    lifestyle_watch_r_movies: requiredString,
    lifestyle_multiple_piercings_ok: requiredString,
    lifestyle_tattoos_ok: requiredString,
    lifestyle_homeschooling: requiredString,
    lifestyle_holistic_preference: requiredString,
    lifestyle_mental_health_meds_ok: requiredString,
    lifestyle_vasectomy_ok: requiredString,
    lifestyle_birth_control_ok: requiredString,
    lifestyle_support_no_baptism_age_8: requiredString,
    lifestyle_mothers_stay_home: requiredString,

    // Section 5A: Social Connections
    social_enjoy_ward: requiredString,
    social_friends_lds: requiredString,
    social_friends_non_lds: requiredString,
    social_mission_enjoy: requiredString,
    social_children_friends: requiredString,
    social_left_church_touch: requiredString,
    social_respect_leave: requiredString,

    // Section 5B: Political & Theological Alignment
    align_conservative: requiredString,
    align_liberal: requiredString,

    // Section 5C: Institutional Attitudes
    church_discipline: requiredString,
    transparency_history: requiredString,
    transparency_finances: requiredString,
    child_marry_non_lds: requiredString,

});

export type SurveyValues = z.infer<typeof surveySchema>;
