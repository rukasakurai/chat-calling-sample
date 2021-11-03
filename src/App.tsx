import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import {
  ChatComposite,
  ChatAdapter,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useEffect, useState } from 'react';
import {CommunicationIdentityClient } from '@azure/communication-identity'
import CallCompositeScreen from './CallComposite';

function App(): JSX.Element {

  //DO NOT DO THIS ON CLIENT CODE. THIS SHOULD BE DONE IN TRUSTED SERVICE
  const endpointUrl = '';
  const connectionString = '';

  const displayName = 'David';

  const [userId, setUserId] = useState<string>();
  const [credential, setCredential] = useState<AzureCommunicationTokenCredential>();

  //Chat Variables
  const [threadId, setThreadId] = useState<string>();
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();

  //DO NOT DO THIS ON CLIENT CODE. THIS SHOULD BE DONE IN TRUSTED SERVICE
  useEffect(() => {
    const createUser = async (): Promise<void> => {
      const identityClient = new CommunicationIdentityClient(connectionString);
      await identityClient.createUserAndToken(['voip', 'chat']).then( async (res) => {
        console.log(res.token)
        setUserId(res.user.communicationUserId);
        setCredential(new AzureCommunicationTokenCredential(res.token));
        console.log(userId);
        console.log(credential);
      })
    }
    createUser();
  }, []);

  //DO NOT DO THIS ON CLIENT CODE. THIS SHOULD BE DONE IN TRUSTED SERVICE
  useEffect(() => {
    const createThread = async (): Promise<void> => {
      if(credential !== undefined && userId !== undefined){
        let chatClient = new ChatClient(endpointUrl, credential);
        let chatThread = await chatClient.createChatThread(
          {
            topic:"Test Thread"
          },
          {
            participants: [
              {
                id: {communicationUserId: userId},
                displayName: displayName
              }
            ]
          }
        ).then((res) => {
          setThreadId(res.chatThread?.id)
        })
      }
    }
    createThread();
  }, [credential, userId])

  //DO NOT DO THIS ON CLIENT CODE. THIS SHOULD BE DONE IN TRUSTED SERVICE
  useEffect(() => {
    const createAdapter = async (): Promise<void> => {
      if(credential !== undefined && userId !== undefined && threadId !== undefined){
      setChatAdapter(
        await createAzureCommunicationChatAdapter({
          endpointUrl,
          userId: { communicationUserId: userId },
          displayName,
          credential,
          threadId
        })
      );
      }
    };
    createAdapter();
  }, [threadId]);

  const [call, setCall] = useState(false);

  if (!!chatAdapter && userId !== undefined && credential !== undefined && threadId !== undefined) {
    return (
      <>
        <button onClick={() => setCall(true)}>
          Call
        </button>
        { !call && <div style={{height:'90vh'}}>
          <ChatComposite adapter={chatAdapter}/>
        </div> }
        {call && <CallCompositeScreen userId={userId} credential={credential} threadId={threadId} endpoint={endpointUrl}/>}

      </>
    );
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

export default App;
