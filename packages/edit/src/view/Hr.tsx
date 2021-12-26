import React, { forwardRef, LegacyRef } from "react";

export const Hr = forwardRef((props, ref: LegacyRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className="md-hr">
      <hr />
    </div>
  );
});
