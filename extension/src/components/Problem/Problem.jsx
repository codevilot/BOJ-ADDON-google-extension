import { useQuery } from "@tanstack/react-query";
import { bojApi } from "../../api/BOJApi";
import { useState, useEffect } from "react";
import DOMPurify from 'dompurify';
import TestCase from "../TestCase/TestCase";
export const BOJProblem = ({ problemId }) => {
  const [ready, setReady] = useState(false);
  const { data: html } = useQuery({
    queryKey: ["boj-problem", problemId],
    queryFn: async () => {
      const rawHtml = await bojApi.problem(problemId);
      return DOMPurify.sanitize(rawHtml);
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });



  useEffect(() => {
    if (!html) return;

    const observer = new MutationObserver(() => {
      const hint = document.getElementById("hint");
      if (!hint) return
        setReady(true);
        observer.disconnect();
    });

    observer.observe(document.body, {childList: true,subtree: true,});

    return () => observer.disconnect();
  }, [html]);

  return (
    <>
      <div
        className="boj-problem"
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
      />
      {ready && <TestCase />}
    </>
  );
};
