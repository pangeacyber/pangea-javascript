// <https://github.com/parcel-bundler/parcel/issues/9050#issuecomment-1565658989>

import { Optimizer } from "@parcel/plugin";
import utils from "@parcel/utils";
import SourceMap from "@parcel/source-map";

export default new Optimizer({
  async optimize({ contents, map, options }) {
    let correctMap;
    if (map != null) {
      correctMap = new SourceMap.default(options.projectRoot);
      correctMap.addSourceMap(map, 1); // 1 = offset lines by 1
    }

    const origContents = await utils.blobToString(contents);
    const nextContents = /use client/g.test(origContents)
      ? '"use client";\n\n' + origContents.replaceAll('"use client";', "")
      : origContents;

    return { contents: nextContents, map: correctMap };
  },
});
