interface ElementAnimation {
  keyframes: Keyframe[] | PropertyIndexedKeyframes;
  options?: KeyframeAnimationOptions;
}

interface ElementAnimationMap {
  [animationName: string]: ElementAnimation;
}

const defaultAnimationRegistry = new Map<String, ElementAnimation>();
const customAnimationRegistry = new WeakMap<Element, ElementAnimationMap>();

//
// Sets a default animation. Components should use the `name.animation` for primary animations and `name.part.animation`
// for secondary animations, e.g. `alert.show` and `dialog.overlay.show`.
//
export function setDefaultAnimation(animationName: string, animation: ElementAnimation) {
  defaultAnimationRegistry.set(animationName, animation);
}

//
// Sets a custom animation for the specified element.
//
export function setAnimation(el: Element, animationName: string, animation: ElementAnimation) {
  customAnimationRegistry.set(
    el,
    Object.assign({}, customAnimationRegistry.get(el), {
      [animationName]: animation
    })
  );
}

//
// Gets an element's custom animation. Falls back to the default animation if no custom one is found.
//
export function getAnimation(el: Element, animationName: string) {
  const customAnimation = customAnimationRegistry.get(el);

  // Check for a custom animation
  if (customAnimation && customAnimation[animationName]) {
    return customAnimation[animationName];
  }

  // Check for a default animation
  const defaultAnimation = defaultAnimationRegistry.get(animationName);
  if (defaultAnimation) {
    return defaultAnimation;
  }

  // Fall back to an empty animation
  return {
    keyframes: [],
    options: { duration: 0 }
  };
}