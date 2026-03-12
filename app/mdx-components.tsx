import { ReactNode } from "react";

import { ContentLayout, StaticContentLayout } from "@/components/layout";
import { Actions, Examples, Intro, Tutorial } from "@/homepage";

const Wrapper = ({
  contentId,
  children,
}: {
  contentId: unknown;
  children: ReactNode;
}) => {
  return contentId === "home" ? (
    <ContentLayout>{children}</ContentLayout>
  ) : (
    <StaticContentLayout>{children}</StaticContentLayout>
  );
};

export function useMDXComponents(components: Record<string, unknown>) {
  return {
    wrapper: Wrapper,
    Actions,
    Intro,
    Tutorial,
    Examples,
    ...components,
  };
}
