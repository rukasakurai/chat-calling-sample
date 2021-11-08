import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import {
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter,
  MeetingComposite,
  createAzureCommunicationMeetingAdapter,
  MeetingAdapter
} from '@azure/communication-react';
import React, { useEffect, useState } from 'react';
import {CommunicationIdentityClient } from '@azure/communication-identity'

interface CompositeProps {
    credential: AzureCommunicationTokenCredential,
    userId: string,
    endpoint: string,
    threadId: string
}

function CallCompositeScreen(props: CompositeProps): JSX.Element {

  //DO NOT DO THIS ON CLIENT CODE. THIS SHOULD BE DONE IN TRUSTED SERVICE
  const displayName = 'YourName';

  //Calling Variables
  //For Group Id, developers can pass any GUID they can generate
  const groupId = '8805799d-0f59-4873-a2d5-b339f26e447c';
  const [meetingAdapter, setMeetingAdapter] = useState<MeetingAdapter>();


  useEffect(() => {
    const createAdapter = async (): Promise<void> => {
      if(props.credential !== undefined && props.userId !== undefined){
        setMeetingAdapter(
        await createAzureCommunicationMeetingAdapter({
          userId: { communicationUserId: props.userId },
          displayName,
          credential: props.credential,
          callLocator: { groupId },
          endpointUrl:props.endpoint,
          chatThreadId: props.threadId
        })
      );
      }
    };
    createAdapter();
  }, []);

  if (!!meetingAdapter) {
    return (
      <>
        <div style={{height:'90vh'}}>
            <MeetingComposite meetingAdapter={meetingAdapter} />
        </div>
      </>
    );
  }
  if (props.credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

export default CallCompositeScreen;
