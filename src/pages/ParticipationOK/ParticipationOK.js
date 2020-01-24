import React, { useEffect, useState } from 'react'
import firebase from 'firebase'
import Config from '../Config/config'
import styles from '../profil.module.css'
import VotingOK from '../../../static/images/VotingOK.png'
import { FullWidthContainer } from '../../components/FullWidthContainer'

export function ParticipationOK () {

  const [meetup, setMeetup] = useState(null)

  function refreshPage () {
    window.location.reload()
  }

  // Initialise Firebase
  let user = firebase.auth().currentUser
  let db = firebase.firestore(Config)

  // UPDATE LE TABLEAU DES INSCRITS SUR FIREBASE
  let update = props => {
    db.collection('nantesjs')
      .doc(props)
      .update({
        Participants: firebase.firestore.FieldValue.arrayUnion({
          Name : `${ user.displayName }`,
          Email : `${ user.email }`,
        })
      })
  }

  // RECUPERE L'ID DU DERNIER MEETUP SUR FIREBASE
  let app = db.collection('nantesjs').orderBy('Date', 'desc').limit(1)
  app.get().then(doc => {
    let lastElement = doc.docChanges()[doc._snapshot.docChanges.length - 1]
    let array = lastElement.doc.id
    update(array)
    setMeetup(array)
  })

  useEffect(() => {
    db.collection('user').doc(user.uid).update({ counter: firebase.firestore.FieldValue.increment(1) })
  }, [])

  return (
    <div>
      <div className={styles.profilPage__ImageAndName}>
        <h1>Mon profil</h1>
        <p>Votre participation au NantesJS {meetup} a bien été enregistrée !</p>
      </div>
      <FullWidthContainer>
        <div className={styles.profilPage__QRCodeDiv}>
          <div className={styles.QRCodeDiv__QRCodeImageOn}>
            <img src={VotingOK} alt="QRCode" className={styles.QRCodeDiv__QRCodeImage} />
            <button className={styles.QRCodeDiv__QRCodeButton} onClick={refreshPage}>Revenir à mon profil</button>
          </div>
        </div>
      </FullWidthContainer>
    </div>
  )
}