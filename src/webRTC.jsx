import React from "react";
import firebase from "firebase/compat/app";

//WebRTC
const RTC = React.memo(({
  pc,
  setPc,
  localStream,
  remoteStream,
  localStreamRef,
  remoteStreamRef,
  activeFriend,
}) => {
  //Reference firestore collection
  const callDoc = firebase.firestore().collection("calls").doc();
  const offerCandidates = callDoc.collection("offerCandidates");
  const answerCandidates = callDoc.collection("answerCandidates");

  var callInput = callDoc.id;
  const startCalling = async () => {
    //Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer, userUID: activeFriend });

    //Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }

    });
    //When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
    console.log("working");
  };

  //3. Answer the call with unique ID
  const answerHandle = async () => {
    const callId = callInput;
    const callDoc = firebase.firestore().collection("calls").doc(callId);
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change);
        let data = change.doc.data();
        pc.addIceCandidate(new RTCIceCandidate(data));
      });
    });
  };
  startCalling();
  return (
    <div className="grid grid-cols-2 gap-3">
      <video ref={localStreamRef}></video>
      <video src={remoteStreamRef}></video>
    </div>
  );
});

export default RTC;
