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
import { Action, InteractorButtonType } from "../src/stores/Action";

const HomePage: NextPage = observer(function () {
  const [actionStore] = useState(() => new ActionStore())
  const [eventStore] = useState(() => new EventStore(actionStore))

  const boxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // RECOMMEND use react-spring
    // for now I will implement it by vanilla JS

    // We also can use draggable, drag events for this
    // but I implement real drag drop by mouse events
    // for more control (style, animation, ...) when moving element
    eventStore.registerEvents(boxContainerRef);

    return () => {
      eventStore.cleanupEvents(boxContainerRef);
    }
  }, []);

  const renderDraggableElements = () => <>{eventStore.DRAGGABLE_ELEMENTS.map(el => <DraggableElement key={el.id} driver={el} />)}</>

  const renderItem = (action: Action) => {
    switch (action.type) {
      case InteractorButtonType.BUTTON:
        return <button className="rounded items-center justify-center py-1.5 px-6 txet-white bg-cyan-500 hover:bg-cyan-400" key={action.id} value={action.props.label} onClick={action.props.action}>{action.props.label}</button>
      case InteractorButtonType.PARAGRAPH:
        return <p key={action.id}>{action.props.label}</p>
      default:
        throw new Error("Unsupported this type");
    }
  }

  return (
    <PageLayout>
      <div className="h-full">
        <Controller driver={actionStore} />
        <Board
          renderLeft={renderDraggableElements}
          renderRight={() => (
            <div ref={boxContainerRef}>
              {actionStore.visibleActions.map(action => <div className="mb-2" key={action.id}>{renderItem(action)}</div>)}
            </div>
          )}
        />
      </div>
    </PageLayout>
  )
});

export default HomePage