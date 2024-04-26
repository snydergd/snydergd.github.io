import sections from "../sections";
import routes from "../routes";
import React from "react";

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
        this._indicateChanged();
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
    getSectionPartsCompleted(sectionName) {
        const allSectionChallenges = routes.filter(x => x.isChallenge && x.section === sectionName);
        const progress = self.loadProgress();
        const result = {};
        allSectionChallenges.filter(x => progress.completedChallenges && progress.completedChallenges[x.path]).forEach((_,i) => {result[i] = true});
        return result;
    },
    useProgress() {
        const [progress, setProgress] = React.useState(self.getProgress());
        React.useEffect(() => {
            self.nextChangePromise().then(() => {
                setProgress(self.getProgress());
            });
        });
        return progress;
    },
    changeCallbacks: [],
    _nextChangePromise: null,
    _indicateChanged(stuff) {},
    nextChangePromise() {
        const setPromise = () => {
            self._nextChangePromise = new Promise(resolve => { self._indicateChanged = () => {setPromise(); resolve()}; });
        };
        if (!self._nextChangePromise) {
            setPromise();
        }
        return self._nextChangePromise;
    },
    clear() {
        localStorage.removeItem(progressKey);
        console.log("change clear")
        self._indicateChanged();
    },
};
window.challengeProgress = self;
export const progress = self;
export default progress;