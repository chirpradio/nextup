function getTitle(vm) {
  const { title } = vm.$options;
  if (title) {
    return typeof title === "function" ? title.call(vm) : title;
  }
}

export default {
  updated() {
    const title = getTitle(this);
    const appName = "NextUp";
    document.title = title ? `${title} – ${appName}` : appName;
  },
};
