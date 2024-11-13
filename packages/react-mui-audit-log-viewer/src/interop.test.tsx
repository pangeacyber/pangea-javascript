import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

// Intentionally leave `src/` in order to test against the built package. This
// test is meant to ensure that the Rollup config produces something that works
// in CommonJS.
import { type Audit, AuditLogViewer } from "..";

test("can render the Audit log viewer", async () => {
  const promise = Promise.resolve();
  const onSearch = jest.fn(
    (_body: Audit.SearchRequest) =>
      promise as unknown as Promise<Audit.SearchResponse>
  );
  const onPageChange = jest.fn(
    (_body: Audit.ResultRequest) =>
      promise as unknown as Promise<Audit.ResultResponse>
  );

  render(<AuditLogViewer onSearch={onSearch} onPageChange={onPageChange} />);

  await act(async () => {
    await promise;
  });
});
