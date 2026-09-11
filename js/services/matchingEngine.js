/**
 * SkillSwap Intelligent Matching Algorithm
 * Calculates 6-factor compatibility score and generates "Why you match" insights
 *
 * Formula:
 * - 40% Skill Compatibility (Two-way reciprocal barter)
 * - 20% Experience Compatibility (Teacher mastery vs Learner goal)
 * - 15% Availability Compatibility (Overlapping timeslots)
 * - 10% Learning Goals & Mode Compatibility (Online / In-person synergy)
 * - 10% Language Compatibility (Shared conversational languages)
 * - 5% Rating & Reliability
 */

export function calculateCompatibility(currentUser, targetUser) {
  if (!currentUser || !targetUser) return { totalScore: 0, breakdown: {}, reasons: [] };

  const currentTeaches = (currentUser.skillsTeach || []).map(s => s.name.toLowerCase());
  const currentWants = (currentUser.skillsWant || []).map(s => s.name.toLowerCase());
  const targetTeaches = (targetUser.skillsTeach || []).map(s => s.name.toLowerCase());
  const targetWants = (targetUser.skillsWant || []).map(s => s.name.toLowerCase());

  const reasons = [];

  /* 1. Skill Compatibility (Max 40 points) */
  let skillScore = 0;
  const targetTeachesWhatIWant = targetUser.skillsTeach?.find(st =>
    currentWants.some(cw => cw.includes(st.name.toLowerCase()) || st.name.toLowerCase().includes(cw))
  );

  const iTeachWhatTargetWants = currentUser.skillsTeach?.find(st =>
    targetWants.some(tw => tw.includes(st.name.toLowerCase()) || st.name.toLowerCase().includes(tw))
  );

  if (targetTeachesWhatIWant) {
    skillScore += 20;
    reasons.push(`They teach ${targetTeachesWhatIWant.name}`);
    reasons.push(`You want to learn ${targetTeachesWhatIWant.name}`);
  }

  if (iTeachWhatTargetWants) {
    skillScore += 20;
    reasons.push(`You teach ${iTeachWhatTargetWants.name}`);
    reasons.push(`They want to learn ${iTeachWhatTargetWants.name}`);
  }

  // Complementary category synergy fallback if direct match is partial
  if (skillScore < 40) {
    const currentTeachCats = (currentUser.skillsTeach || []).map(s => s.category);
    const targetWantCats = (targetUser.skillsWant || []).map(s => s.category);
    const hasCatSynergy = currentTeachCats.some(c => targetWantCats.includes(c));
    if (hasCatSynergy && skillScore === 20) {
      skillScore += 8;
      reasons.push("Complementary creative/technical domain synergy");
    } else if (skillScore === 0) {
      skillScore = 12; // Base partial discovery score
    }
  }

  /* 2. Experience Compatibility (Max 20 points) */
  let experienceScore = 14;
  if (targetTeachesWhatIWant && targetTeachesWhatIWant.level === "Expert") {
    experienceScore = 20;
    reasons.push(`They have ${targetTeachesWhatIWant.level} mastery in ${targetTeachesWhatIWant.name}`);
  } else if (targetTeachesWhatIWant && targetTeachesWhatIWant.level === "Advanced") {
    experienceScore = 18;
  }

  /* 3. Availability Compatibility (Max 15 points) */
  let availabilityScore = 5;
  const currentAvail = currentUser.availability || [];
  const targetAvail = targetUser.availability || [];
  const sharedSlots = currentAvail.filter(slot => targetAvail.includes(slot));

  if (sharedSlots.length >= 2) {
    availabilityScore = 15;
    reasons.push(`Your ${sharedSlots.join(" and ").toLowerCase()} availability overlaps`);
  } else if (sharedSlots.length === 1) {
    availabilityScore = 11;
    reasons.push(`You both are available on ${sharedSlots[0].toLowerCase()}`);
  }

  /* 4. Learning Goals & Mode Compatibility (Max 10 points) */
  let goalsScore = 7;
  const currentMode = currentUser.mode || "both";
  const targetMode = targetUser.mode || "both";

  if (currentMode === targetMode || currentMode === "both" || targetMode === "both") {
    goalsScore = 10;
    const modeLabel = (currentMode === "both" || targetMode === "both") ? "online and in-person" : currentMode;
    reasons.push(`Compatible exchange format (${modeLabel})`);
  }

  /* 5. Language Compatibility (Max 10 points) */
  let languageScore = 5;
  const currentLangs = currentUser.languages || ["English"];
  const targetLangs = targetUser.languages || ["English"];
  const sharedLangs = currentLangs.filter(l => targetLangs.includes(l));

  if (sharedLangs.length > 0) {
    languageScore = 10;
    reasons.push(`Shared language: ${sharedLangs.join(", ")}`);
  }

  /* 6. Rating & Reliability (Max 5 points) */
  let ratingScore = 4;
  const targetRating = targetUser.rating || 4.5;
  if (targetRating >= 4.9) {
    ratingScore = 5;
    reasons.push(`High reliability rating (${targetRating} / 5.0 with ${targetUser.completedExchanges || 0} exchanges)`);
  } else if (targetRating >= 4.7) {
    ratingScore = 4.5;
  }

  const totalScore = Math.min(100, Math.round(
    skillScore + experienceScore + availabilityScore + goalsScore + languageScore + ratingScore
  ));

  return {
    totalScore,
    isTwoWayMatch: (targetTeachesWhatIWant && iTeachWhatTargetWants) ? true : false,
    matchedOfferSkill: targetTeachesWhatIWant ? targetTeachesWhatIWant.name : null,
    matchedRequestSkill: iTeachWhatTargetWants ? iTeachWhatTargetWants.name : null,
    reasons: [...new Set(reasons)],
    breakdown: {
      skills: { label: "Skill Compatibility", weight: "40%", score: skillScore, max: 40 },
      experience: { label: "Experience Level Match", weight: "20%", score: experienceScore, max: 20 },
      availability: { label: "Availability Overlap", weight: "15%", score: availabilityScore, max: 15 },
      goals: { label: "Learning Goals & Mode", weight: "10%", score: goalsScore, max: 10 },
      language: { label: "Language Synergy", weight: "10%", score: languageScore, max: 10 },
      reliability: { label: "Rating & Reliability", weight: "5%", score: ratingScore, max: 5 }
    }
  };
}
