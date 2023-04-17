import { html, TemplateResult } from "lit-html";
import { dapps } from "./dapps";

/** A teaser for the dapps explorer, acting as a button */
export const dappsTeaser = ({
  click,
}: {
  click: () => void;
}): TemplateResult => {
  return html`<article class="c-card c-card--narrow">
    <h3 class="t-title t-title--discrete" role="presentation">
      Dapps explorer
    </h3>
    <h2 class="t-title">Explore dapps</h2>
    <button
      class="c-click-area"
      @click="${() => click()}"
      aria-label="Show list of dapps"
    >
      <figure class="c-card__teaser c-marquee c-marquee--clickable">
        ${marqueeList()}
      </figure>
    </button>
  </article>`;
};

const marqueeList = (): TemplateResult => {
  const itemsPerRow = 5;
  const totalRows = 4;

  const paddedDapps = repeatArray({
    arr: dapps,
    length: itemsPerRow * totalRows,
  });

  /**
   * rows = [
   *   [dapp0, dapp1, dapp2, dapp3, dapp4],
   *   [dapp5, dapp6, dapp7, dapp8, dapp9],
   *   ...,
   *   [dapp0, dapp1, dapp2]
   * ]
   */
  const rows = chunkArray({ arr: paddedDapps, chunkSize: itemsPerRow });

  // rows are duplicated to create the infinite scrolling effect
  return html`<div
    aria-hidden="true"
    class="c-marquee__list"
    style="--itemsPerRow: ${itemsPerRow}; --totalRows: ${totalRows}"
  >
    ${rows.map((rowDapps, i) => {
      const rowContent = rowDapps.map(
        ({ logo, name }) => html`<div class="c-marquee__item">
          <img
            src=${logo}
            alt="${name}"
            class="c-marquee__image"
            loading="lazy"
          />
        </div>`
      );

      return html`<div class="c-marquee__row" style="--rowIndex: ${i}">
        <div class="c-marquee__rowHalf">${rowContent}</div>
        <div class="c-marquee__rowHalf c-marquee__rowHalf--second">
          ${rowContent}
        </div>
      </div>`;
    })}
  </div>`;
};

// Helpers

/**
 * Pad the array by repeating it until it has the desired number of items.
 */
const repeatArray = <T>({ arr, length }: { arr: T[]; length: number }): T[] =>
  Array.from(new Array(length), (_, index) => arr[index % arr.length]);

/**
 * Chunk an array into chunks of the specified size (last chunk may be smaller)
 */
const chunkArray = <T>({
  arr,
  chunkSize,
}: {
  arr: T[];
  chunkSize: number;
}): T[][] =>
  Array.from(new Array(Math.ceil(dapps.length / chunkSize)), (_, index) =>
    arr.slice(index * chunkSize, index * chunkSize + chunkSize)
  );