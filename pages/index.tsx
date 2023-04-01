import React from "react";
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { Board } from '../src/components/Board/Board'
import { Controller } from '../src/components/Controller/Controller'
import { DraggableElement } from '../src/components/DraggableElement/DraggableElement'
import { PageLayout } from '../src/components/PageLayout/PageLayout'
import { EventStore } from "../src/stores/EventStore";
import { ActionStore } from "../src/stores/ActionStore";
import { Action, InteractorButtonType } from "../src/stores/models/Action";
import { TheMessage } from "../src/components/TheMessage/TheMessage";
import { TheMessageStore } from "../src/stores/TheMessageStore";
import { ActionEdit } from "../src/components/ActionEdit/ActionEdit";
import { getDraggableElements } from "../src/shared/constant";
import { TheHeader } from "../src/components/TheHeader/TheHeader";
import Link from "next/link";

const HomePage: NextPage = observer(function () {
  const DRAGGABLE_ELEMENTS = getDraggableElements()

  const [theMessageStore] = useState(() => new TheMessageStore())
  const [actionStore] = useState(() => new ActionStore(theMessageStore))
  const [eventStore] = useState(() => new EventStore(actionStore, DRAGGABLE_ELEMENTS))

  const boxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // RECOMMEND use react-spring
    // for now I will implement it by vanilla JS

    // We also can use draggable, drag events for this
    // but I implement real drag drop by mouse events
    // for more control (style, animation, ...) when moving element
    eventStore.registerEvents(boxContainerRef);
    eventStore.initLocalActions();

    return () => {
      eventStore.cleanupEvents(boxContainerRef);
    }
  }, []);


  const renderItem = (action: Action) => {
    switch (action.type) {
      case InteractorButtonType.BUTTON:
        return (
          <button
            className={`rounded items-center justify-center py-1.5 px-6 txet-white bg-cyan-500 hover:bg-cyan-400 ${action.id === actionStore.inEditAction?.id ? "border-green-900 border-2" : ""}`}
            key={action.id}
            value={action.props.label}
            onClick={() => actionStore.updateEditAction(action)}>
            {action.props.label || "Please fill me"}
          </button>
        )
      case InteractorButtonType.PARAGRAPH:
        return (
          <p
            className={`cursor-pointer ${action.id === actionStore.inEditAction?.id ? "border-green-900 border-2" : ""}`}
            onClick={() => actionStore.updateEditAction(action)}
            key={action.id}
            style={{ minHeight: "26px" }}
          >
            {action.props.label || "Please fill me"}
          </p>
        )
      default:
        throw new Error("Unsupported this type");
    }
  }

  return (
    <PageLayout renderHeader={() => <TheHeader title="Admin Dashboard" />}>
      <div className="h-full">
        <Controller driver={actionStore} />
        <Board
          driver={actionStore}
          renderLeft={
            () => <>{DRAGGABLE_ELEMENTS.map(el => <DraggableElement key={el.id} driver={el} />)}</>
          }
          renderRight={() => (
            <div ref={boxContainerRef}>
              {actionStore.visibleActions.map(action => <div className="mb-2" key={action.id}>{renderItem(action)}</div>)}
            </div>
          )}
          renderEditAction={() => <ActionEdit driver={actionStore} />}
        />
      </div>

      <TheMessage driver={theMessageStore} />

    </PageLayout>
  )
});

export default HomePage