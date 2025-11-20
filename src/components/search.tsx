"use client";
import {
  type ComponentProps,
  createContext,
  type SyntheticEvent,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader2, RefreshCw, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import Link from "fumadocs-core/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  type DialogProps,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { type UIMessage, useChat, type UseChatHelpers } from "@ai-sdk/react";
import type { ProvideLinksToolSchema } from "../lib/inkeep-qa-schema";
import type { z } from "zod";
import { DefaultChatTransport } from "ai";
import { Markdown } from "./markdown";

const ChatContext = createContext<UseChatHelpers<UIMessage> | null>(null);
function useChatContext() {
  return use(ChatContext)!;
}

function SearchAIActions(props: ComponentProps<"div">) {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === "streaming";

  if (messages.length === 0) return null;

  return (
    <div {...props}>
      {!isLoading && messages.at(-1)?.role === "assistant" && (
        <button
          type="button"
          className={cn(
            buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "gap-1.5 rounded-full",
            }),
          )}
          onClick={() => regenerate()}
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      )}
      <button
        type="button"
        className={cn(
          buttonVariants({
            variant: "secondary",
            size: "sm",
            className: "rounded-full",
          }),
        )}
        onClick={() => setMessages([])}
      >
        Clear Chat
      </button>
    </div>
  );
}

function SearchAIInput(props: ComponentProps<"form">) {
  const { status, sendMessage, stop } = useChatContext();
  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";
  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault();
    void sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    if (isLoading) document.getElementById("nd-ai-input")?.focus();
  }, [isLoading]);

  return (
    <form
      {...props}
      className={cn("flex items-start pe-2", props.className)}
      onSubmit={onStart}
    >
      <Input
        value={input}
        placeholder={isLoading ? "AI is answering..." : "Ask AI something"}
        className="max-h-60 min-h-10 p-3"
        disabled={status === "streaming" || status === "submitted"}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === "Enter") {
            onStart(event);
          }
        }}
      />
      {isLoading ? (
        <button
          type="button"
          className={cn(
            buttonVariants({
              variant: "secondary",
              className: "mt-2 gap-2 rounded-full",
            }),
          )}
          onClick={stop}
        >
          <Loader2 className="text-fd-muted-foreground size-4 animate-spin" />
          Abort Answer
        </button>
      ) : (
        <button
          type="submit"
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "transition-full mt-2 rounded-full",
              size: "icon",
            }),
          )}
          disabled={input.length === 0}
        >
          <Send className="size-4" />
        </button>
      )}
    </form>
  );
}

function List(props: Omit<ComponentProps<"div">, "dir">) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    function callback() {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "instant",
      });
    }

    const observer = new ResizeObserver(callback);
    callback();

    const element = containerRef.current?.firstElementChild;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        "fd-scroll-container flex max-h-[calc(100dvh-240px)] min-w-0 flex-col overflow-y-auto",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

function Input(props: ComponentProps<"textarea">) {
  const ref = useRef<HTMLDivElement>(null);
  const shared = cn("col-start-1 row-start-1", props.className);

  return (
    <div className="grid flex-1">
      <textarea
        id="nd-ai-input"
        {...props}
        className={cn(
          "placeholder:text-fd-muted-foreground resize-none bg-transparent focus-visible:outline-none",
          shared,
        )}
      />
      <div ref={ref} className={cn(shared, "invisible break-all")}>
        {`${props.value?.toString() ?? ""}\n`}
      </div>
    </div>
  );
}

const roleName: Record<string, string> = {
  user: "you",
  assistant: "fumadocs",
};

function Message({
  message,
  ...props
}: { message: UIMessage } & ComponentProps<"div">) {
  let markdown = "";
  let links: z.infer<typeof ProvideLinksToolSchema>["links"] = [];

  for (const part of message.parts ?? []) {
    if (part.type === "text") {
      markdown += part.text;
      continue;
    }

    if (part.type === "tool-provideLinks" && part.input) {
      links = (part.input as z.infer<typeof ProvideLinksToolSchema>).links;
    }
  }

  return (
    <div {...props}>
      <p
        className={cn(
          "text-fd-muted-foreground mb-1 text-sm font-medium",
          message.role === "assistant" && "text-fd-primary",
        )}
      >
        {roleName[message.role] ?? "unknown"}
      </p>
      <div className="prose text-sm">
        <Markdown text={markdown} />
      </div>
      {links && links.length > 0 ? (
        <div className="mt-2 flex flex-row flex-wrap items-center gap-1">
          {links.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              className="hover:bg-fd-accent hover:text-fd-accent-foreground block rounded-lg border p-3 text-xs"
            >
              <p className="font-medium">{item.title}</p>
              <p className="text-fd-muted-foreground">Reference {item.label}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AISearch(props: DialogProps) {
  const chat = useChat({
    id: "search",
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const messages = chat.messages.filter((msg) => msg.role !== "system");

  return (
    <Dialog {...props}>
      {props.children}
      <DialogPortal>
        <DialogOverlay className="data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in fixed inset-0 z-50 backdrop-blur-xs" />
        <DialogContent
          onOpenAutoFocus={(e) => {
            document.getElementById("nd-ai-input")?.focus();
            e.preventDefault();
          }}
          aria-describedby={undefined}
          className="bg-fd-popover/80 data-[state=open]:animate-fd-dialog-in data-[state=closed]:animate-fd-dialog-out fixed left-1/2 z-50 flex w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 flex-col rounded-2xl border p-1 shadow-2xl backdrop-blur-xl focus-visible:outline-none max-md:top-12 md:bottom-12"
        >
          <ChatContext value={chat}>
            <div className="px-3 py-2">
              <DialogTitle className="text-sm font-medium">
                Inkeep AI
              </DialogTitle>
              <DialogDescription className="text-fd-muted-foreground text-xs">
                AI can be inaccurate, please verify the information.
              </DialogDescription>
            </div>
            <DialogClose
              aria-label="Close"
              tabIndex={-1}
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "ghost",
                  className: "text-fd-muted-foreground absolute end-1 top-1",
                }),
              )}
            >
              <X />
            </DialogClose>

            {messages.length > 0 && (
              <List
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)",
                }}
              >
                <div className="flex flex-col gap-4 p-3">
                  {messages.map((item) => (
                    <Message key={item.id} message={item} />
                  ))}
                </div>
              </List>
            )}
            <div className="border-fd-foreground/20 text-fd-popover-foreground overflow-hidden rounded-xl border">
              <SearchAIInput />
              <SearchAIActions className="flex flex-row items-center gap-1.5 p-1 empty:hidden" />
            </div>
          </ChatContext>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
