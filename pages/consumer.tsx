import React from "react";
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { PageLayout } from '../src/components/PageLayout/PageLayout'
import { Action, InteractorButtonType } from "../src/stores/models/Action";
import { ConsumerStore } from "../src/stores/ConsumerStore";
import { TheHeader } from "../src/components/TheHeader/TheHeader";
import { USER_CORRELATION_ID } from "../src/shared/constant";

const ConsumerPage: NextPage = observer(function () {
  const [pageStore] = useState(() => new ConsumerStore());

  useEffect(() => {
    const userId = localStorage.getItem(USER_CORRELATION_ID);
    if (!userId) return;
    (async () => {
      const response = await fetch(`/api/get-actions?uid=${userId}`);

      const actions = await response.json();

      pageStore.actions.replace(actions);
    })();
  }, []);


  const renderItem = (action: Action) => {
    switch (action.type) {
      case InteractorButtonType.BUTTON:
        return (
          <button
            className={`rounded items-center justify-center py-1.5 px-6 txet-white bg-cyan-500 hover:bg-cyan-400`}
            key={action.id}
            value={action.props.label}
            onClick={() => action.props.alertMessage && alert(action.props.alertMessage)}>
            {action.props.label}
          </button>
        )
      case InteractorButtonType.PARAGRAPH:
        return (
          <p
            key={action.id}
          >
            {action.props.label}
          </p>
        )
      default:
        throw new Error("Unsupported this type");
    }
  }

  return (
    <PageLayout renderHeader={() => <TheHeader title="Consumer" />}>
      <div className="h-full">
        <div className="p-4">
          {pageStore.actions.map(action => (
            <div className="mb-2" key={action.id}>{renderItem(action)}</div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
});

export default ConsumerPage;