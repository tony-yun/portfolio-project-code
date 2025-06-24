"use client";

import { Button, NdsButton, NdsIcon } from "@/components/common";
import {
  ConDetailInfo,
  ConHeadInfo,
  ConImage,
  FooterTerritory,
} from "@/components/public";
import { imageUrl } from "@/lib/core/constants";
import { formatInGroupsOfFour } from "@/lib/core/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { fetchMe, userKey } from "@/lib/queries/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AnswerListProps {
  id: number;
  key: "admit" | "mistake" | "confirm";
  title: string;
  subtitle: string;
  content: string;
}

interface SellExplanationContentProps {
  conId: string;
}

const SellExplanationContent = ({ conId }: SellExplanationContentProps) => {
  const router = useRouter();

  const { token } = useAuth();

  const [isItemExpanded, setIsItemExpanded] = useState<boolean>(false);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState<
    AnswerListProps["key"] | null
  >(null);

  const { data } = useSuspenseQuery({
    queryKey: userKey.me(token),
    queryFn: fetchMe,
  });

  const answerList: AnswerListProps[] = [
    // fetch query
  ];

  const onClickConHeadInfo = () => {
    setIsItemExpanded(!isItemExpanded);
  };

  const onClickSelectAnswer = (key: AnswerListProps["key"]) => {
    setSelectedAnswerKey(key);
  };

  const onClickConfirm = () => {
    if (selectedAnswerKey === "admit") {
      const conIds = [conId];
      const queryString = new URLSearchParams({
        conIds: conIds.join(","),
      }).toString();

      router.push(`/sell/explanation/refund-con-info?${queryString}`);
    }
  };

  return (
    <main className="pb-[200px]">
      <section className="flex flex-col border-1 border-gray-200 rounded-[16px]">
        <article className="flex flex-row p-4 gap-[12px]">
          <div className="flex flex-shrink-0 justify-center items-center w-[44px] h-[44px] border-1 border-gray-200 rounded-[8px] bg-gray-50">
            <NdsIcon
              group="graphic"
              name="message-left"
              color="gray400"
              size={30}
            />
          </div>
          <p className="text-gray-900 text-[15px] font-[500]">
            이미 사용된 쿠폰이라 쓸 수 없다고 안내받았어요.
          </p>
        </article>

        <div className="h-[1px] w-full bg-gray-200" />

        <article className="flex flex-col p-4">
          <Button onClick={onClickConHeadInfo}>
            <ConHeadInfo
              isItemExpanded={isItemExpanded}
              imageSrc={imageUrl}
              itemName="스타벅스 아메리카노"
            />
          </Button>

          {/* 조건부 렌더링 */}
          <aside
            className={clsx(
              "transition-all duration-500 ease-in-out overflow-hidden",
              isItemExpanded
                ? "max-h-[1000px] opacity-100 translate-y-0 pointer-events-auto"
                : "max-h-0 opacity-0 -translate-y-1.5 pointer-events-none"
            )}
          >
            <div className="h-[12px]" />

            <ConImage src={imageUrl} alt="con-image" />

            <div className="h-[12px]" />

            <ConDetailInfo
              sellPrice={`${Number(10000).toLocaleString()}원`}
              sellDate={dayjs("2025-06-18").format("YYYY.MM.DD")}
              expireDate={`${dayjs("2024-06-18T00:00:00Z").format(
                "YYYY.MM.DD"
              )} 까지`}
              barcode={formatInGroupsOfFour(12345678212190)}
            />
          </aside>
        </article>
      </section>

      <section className="mt-[20px]">
        <p className="text-headline-20-bold text-gray-900">
          답변을 선택해주세요
        </p>

        <article className="flex flex-col gap-[8px] mt-[13px]">
          {answerList.map(({ id, key, title, subtitle, content }) => (
            <Button
              key={id}
              className={clsx(
                "flex flex-col border-1 rounded-[14px] overflow-hidden",
                selectedAnswerKey === key
                  ? "border-gray-900"
                  : "border-gray-200"
              )}
              onClick={() => onClickSelectAnswer(key)}
            >
              <aside
                className={clsx(
                  "flex flex-col items-start px-[16px] pt-[20px]",
                  selectedAnswerKey === key ? "pb-[8px]" : "pb-[20px]"
                )}
              >
                <p className="text-subtitle-16-bold text-gray-900">{title}</p>
                <p className="text-body-14-regular text-gray-700">{subtitle}</p>
              </aside>

              {/* 조건부 렌더링 */}
              <div
                className={clsx(
                  "flex w-full overflow-hidden transition-all ease-in-out px-[16px]",
                  selectedAnswerKey === key
                    ? "max-h-[80px] opacity-100 py-[8px] bg-blue-50 duration-300"
                    : "max-h-0 opacity-0 py-0 duration-200"
                )}
              >
                <p className="text-caption-13-regular text-blue-500">
                  {content}
                </p>
              </div>
            </Button>
          ))}
        </article>
      </section>

      <FooterTerritory
        topSubTitle={
          selectedAnswerKey ? "" : "답변을 선택해주시면 다음 절차로 연결됩니다."
        }
      >
        <NdsButton
          onClick={onClickConfirm}
          disabled={!selectedAnswerKey}
          text={
            !selectedAnswerKey
              ? "답변 선택하기"
              : selectedAnswerKey === "admit"
              ? "환불하기"
              : "추가 답변하기"
          }
        />
      </FooterTerritory>
    </main>
  );
};

export default SellExplanationContent;
