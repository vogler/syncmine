import puppeteer from 'puppeteer';

export const submit = (page: puppeteer.Page) => Promise.all([page.click('[type=submit]'), page.waitForNavigation()]);

declare global {
  interface Window {
    inj: {
      all: (e: Element) => <T extends Element = HTMLElement>(sel: string, interface?: new() => T) => Array<T>,
      allT: (e: Element) => (sel: string) => string[],
      oneT: (e: Element) => (sel: string) => string | undefined,
    }
  }
}
export const inject = (page: puppeteer.Page) => page.evaluate(() => {
  const all = (e: Element) => <T extends Element = HTMLElement>(sel: string) => <Array<T>>Array.from(e.querySelectorAll(sel));
  const allT = (e: Element) => (sel: string) => all(e)(sel).map(e => e.innerText.trim());
  const oneT = (e: Element) => (sel: string) => (es => es.length > 0 ? es[0].innerText.trim() : undefined)(all(e)(sel));
  window.inj = {all, allT, oneT};
});

export const inj_eval_map = async<T> (page: puppeteer.Page, sel: string, f: (e: Element) => T) => {
  await inject(page);
  return await page.$$eval(sel, es => es.map(f));
};
