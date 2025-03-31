import React from 'react';

function TerapiePersonalizata() {
  return (
    <div className="content-card">
      <h2>Terapie Personalizată</h2>
      <p>Oferim soluții personalizate pentru nevoile fiecărui client. Completează formularul de mai jos pentru a începe:</p>
      <form>
        <label>
          Nume:
          <input type="text" name="nume" placeholder="Introdu numele tău" />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" placeholder="Introdu adresa de email" />
        </label>
        <br />
        <label>
          Mesaj:
          <textarea name="mesaj" placeholder="Scrie mesajul tău aici"></textarea>
        </label>
        <br />
        <button type="submit">Trimite</button>
      </form>
    </div>
  );
}

export default TerapiePersonalizata;
