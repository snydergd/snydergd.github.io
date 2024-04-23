import sections from "../sections";
import routes from "../routes";

const progressKey = "codelearn-progress";

const self = {
    loadProgress() {
        console.log("Loading progress");
        const progress = localStorage.getItem(progressKey);
        if (progress) {
            return JSON.parse(progress);
        } else {
            return {};
        }
    },
    saveProgress(progress) {
        console.log("Saving progress");
        localStorage.setItem(progressKey, JSON.stringify(progress));
    },
    getProgress() {
        const progress = self.loadProgress();
        let currentSection = progress.currentSection;
        if (!currentSection) {
            currentSection = 0;
        }
        const sectionName = sections[currentSection].name;
        const allSectionChallenges = routes.filter(x => x.isChallenge && x.section === sectionName);
        const completedSectionChallenges = allSectionChallenges.filter(x => {
            const path = x.path;
            return progress.completedChallenges && progress.completedChallenges[path];
        });
        return Math.floor(completedSectionChallenges.length / allSectionChallenges.length * 100);
    },
    markComplete(path) {
        console.log(`Marking ${path} as complete`);
        const progress = self.loadProgress();
        if (!("completedChallenges" in progress)) {
            progress.completedChallenges = {};
        }
        progress.completedChallenges[path] = true;
        self.saveProgress(progress);
        self.changeCallbacks.forEach(cb => cb());
    },
    changeCallbacks: [],
    onChange(callback) {
        self.changeCallbacks.push(callback);
    },
    clear() {
        localStorage.removeItem(progressKey);
        self.changeCallbacks.forEach(cb => cb());
    },
};
window.challengeProgress = self;
export const progress = self;
export default progress;