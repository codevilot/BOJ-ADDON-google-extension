import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import DOMPurify from 'dompurify';
import { bojApi } from "../api/bojApi";
import TestCase from "./TestCase";
export const BOJProblem = ({ problemId }:{problemId:string}) => {
  const [ready, setReady] = useState(false);
  const { data: html } = useQuery({
    queryKey: ["boj-problem", problemId],
    queryFn: async () => {
      try{
        const rawHtml = await bojApi.problem(problemId);
        return DOMPurify.sanitize(rawHtml);
      }catch(e){
        throw e
      }
    },
    retry: true,
    retryDelay: 1500, 
    staleTime: Infinity,
    gcTime: Infinity,
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
