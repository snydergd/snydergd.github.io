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
    getSectionProgress(sectionName) {
        const allSectionChallenges = routes.filter(x => x.isChallenge && x.section === sectionName);
        const progress = self.loadProgress();
        const completedSectionChallenges = allSectionChallenges.filter(x => {
            const path = x.path;
            return progress.completedChallenges && progress.completedChallenges[path];
        });
        console.log(allSectionChallenges, sectionName, routes, completedSectionChallenges, self.completedChallenges)
        return Math.floor(completedSectionChallenges.length / allSectionChallenges.length * 100);
    },
    getProgress() {
        const progress = self.loadProgress();
        let currentSection = progress.currentSection;
        if (!currentSection) {
            currentSection = 0;
        }
        const sectionName = sections[currentSection].name;
        return self.getSectionProgress(sectionName);
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
    isComplete(path) {
        const progress = self.loadProgress();
        return progress.completedChallenges && progress.completedChallenges[path];
    },
    isSectionComplete(sectionNaame) {
        const allSectionChallenges = routes.filter(x => x.isChallenge && x.section === sectionNaame);
        const completedSectionChallenges = allSectionChallenges.filter(x => {
            const path = x.path;
            return progress.completedChallenges && progress.completedChallenges[path];
        });
        return completedSectionChallenges.length === allSectionChallenges.length;
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