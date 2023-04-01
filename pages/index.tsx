import React, { useMemo } from "react";
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { Board } from '../src/components/Board/Board'
import { Controller } from '../src/components/Controller/Controller'
import { DraggableElement } from '../src/components/DraggableElement/DraggableElement'
import { PageLayout } from '../src/components/PageLayout/PageLayout'
import { EventStore } from "../src/stores/EventStore";
import { ActionStore } from "../src/stores/ActionStore";
import { Action, InteractorButtonType, InteractorItem } from "../src/stores/models/Action";
import { TheMessage } from "../src/components/TheMessage/TheMessage";
import { TheMessageStore } from "../src/stores/TheMessageStore";

const HomePage: NextPage = observer(function () {

  const DRAGGABLE_ELEMENTS: Array<InteractorItem> = [
    {
      id: "draggable-button",
      type: InteractorButtonType.BUTTON,
      name: "button",
      icon: <></>,
      ref: useRef<HTMLDivElement>(null),
    },
    {
      id: "draggable-paragraph",
      type: InteractorButtonType.PARAGRAPH,
      name: "paragraph",
      icon: <></>,
      ref: useRef<HTMLDivElement>(null),
    }
  ];

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

  const renderDraggableElements = () => <>{DRAGGABLE_ELEMENTS.map(el => <DraggableElement key={el.id} driver={el} />)}</>

  const renderItem = (action: Action) => {
    switch (action.type) {
      case InteractorButtonType.BUTTON:
        return (
          <button
            className="rounded items-center justify-center py-1.5 px-6 txet-white bg-cyan-500 hover:bg-cyan-400"
            key={action.id}
            value={action.props.label}
            onClick={() => actionStore.updateEditAction(action)}>
            {action.props.label}
          </button>
        )
      case InteractorButtonType.PARAGRAPH:
        return <p onClick={() => actionStore.updateEditAction(action)} key={action.id}>{action.props.label}</p>
      default:
        throw new Error("Unsupported this type");
    }
  }

  const renderEditAction = () => {
    const { inEditAction } = actionStore;
    if (!inEditAction) return <></>;

    if (inEditAction.type === InteractorButtonType.BUTTON) {
      return (
        <div className="pt-2">
          <form>
            <div className="form-group pb-2">
              <label className="block font-bold">Button name: </label>
              <input type="text" className="form-input px-3 py-2 rounded text-black"
                name="label"
                value={inEditAction.props.label}
                onChange={(e) => actionStore.onEditAction("label", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="block font-bold">Button alert message: </label>
              <input type="text" className="form-input px-3 py-2 rounded text-black"
                name="action"
                value={inEditAction.props.alertMessage}
                onChange={(e) => actionStore.onEditAction("action", e.target.value)}
              />
            </div>
          </form>
        </div>
      )
    }

    return (
      <div></div>
    )

  }

  return (
    <PageLayout>
      <div className="h-full">
        <Controller driver={actionStore} />
        <Board
          driver={actionStore}
          renderLeft={renderDraggableElements}
          renderRight={() => (
            <div ref={boxContainerRef}>
              {actionStore.visibleActions.map(action => <div className="mb-2" key={action.id}>{renderItem(action)}</div>)}
            </div>
          )}
          renderEditAction={renderEditAction}
        />
      </div>

      <TheMessage driver={theMessageStore} />

    </PageLayout>
  )
});

export default HomePage