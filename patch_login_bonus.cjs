const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Currently App.tsx has:
// updatedUser.credits = (updatedUser.credits || 0) + bonusAmount;
// updatedUser.lastLoginRewardDate = new Date().toISOString();
// hasUpdates = true;
// newReward = { ... };

// Because it adds the credits AND sets lastLoginRewardDate in the state check loop,
// if handleClaimReward ALSO adds credits, it double dips. But the user said "baar baar aaraha hai claim karne ke baad".
// This means lastLoginRewardDate isn't actually persisting, OR it's checking "lastRewardDate !== today" and "lastLoginRewardDate" isn't being saved correctly.
// Let's modify the check to also mark it in local storage directly or check if we already showed it in session.

content = content.replace(
    /const lastRewardDate = state\.user\.lastLoginRewardDate \? new Date\(state\.user\.lastLoginRewardDate\)\.toDateString\(\) : '';\s*if \(lastRewardDate !== today && !activeReward\) \{/,
    `const lastRewardDate = state.user.lastLoginRewardDate ? new Date(state.user.lastLoginRewardDate).toDateString() : '';
      if (lastRewardDate !== today && !activeReward && !sessionStorage.getItem('login_bonus_shown_' + today)) {
          sessionStorage.setItem('login_bonus_shown_' + today, 'true');`
);

content = content.replace(
    /updatedUser\.credits = \(updatedUser\.credits \|\| 0\) \+ bonusAmount;\s*updatedUser\.lastLoginRewardDate = new Date\(\)\.toISOString\(\);\s*hasUpdates = true;/,
    `updatedUser.lastLoginRewardDate = new Date().toISOString();\n              hasUpdates = true;`
);

fs.writeFileSync('App.tsx', content);
console.log('Login bonus patched');
