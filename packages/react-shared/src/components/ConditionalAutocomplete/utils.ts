// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

/**
 * Determine the current focused word, as well as the previous word, based on current position in text.
 * Used to determine conditional options based on the current and previous word.
 *
 * FIXME: Unit tests are required.
 *
 * @param text
 * @param cursor
 * @returns { current, previous, currentPosition }
 */
export const determinedFocusedWordsOnCursorPosition = (
  text: string,
  cursor: number
): { current: string; previous: string; currentPosition: [number, number] } => {
  var previous = "";
  var current = "";
  var currentPosition: [number, number] = [cursor, cursor];

  var match = null;
  var position = 0;

  const groupMatch = /[^\s"]+|"([^"]*)"/gi;
  do {
    match = groupMatch.exec(text);
    if (match) {
      const matchedText = match[1] ? match[1] : match[0];

      if (cursor >= position && cursor <= position + matchedText.length) {
        current = matchedText;
        currentPosition = [position, position + matchedText.length];
        break;
      }

      position += matchedText.length + 1;
      previous = matchedText;
    }
  } while (match != null);

  return { current, previous, currentPosition };
};
