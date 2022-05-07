import React from "react";
import firebase from "firebase/compat/app";

//WebRTC
const RTC = React.memo(
  ({ pc, localStreamRef, remoteStreamRef, activeFriend }) => {
    //Reference firestore collection
    const callRef = firebase.firestore().collection("calls");
    const callInput = callRef.doc().id;
    const offerCandidates = callRef.doc(callInput).collection("offerCandidates");
    const answerCandidates = callRef.doc(callInput).collection("answerCandidates");

    const startCalling = async () => {
      await callRef.doc(callInput).set({})
      //Get candidates for caller, save to db
      pc.onicecandidate = (event) => {
        console.log(callInput);
        event.candidate && offerCandidates.doc().set(event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);
      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };
      console.log(callInput);
      await callRef.doc(callInput).set({ offer, userUID: activeFriend });

      //Listen for remote answer
      callRef.doc(callInput).onSnapshot((snapshot) => {
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
    };

    //3. Answer the call with unique ID
    const answerHandle = async () => {
      await callRef.doc(callInput).update({})
      pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callRef.doc(callInput).get()).data();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callRef.doc(callInput).update({ answer });

      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        });
      });
    };
    const handle = async () => {
      await startCalling();
      answerHandle();
    };
    handle();
    return (
      <div className="grid grid-cols-2 gap-3">
        <video autoPlay ref={localStreamRef}></video>
        <video autoPlay ref={remoteStreamRef}></video>
      </div>
    );
  }
);

export default RTC;
