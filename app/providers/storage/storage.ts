import {Injectable} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';

export class Question {
  question: string;
  id: number;
  constructor(question: string, id: number) {
    this.question = question;
    this.id = id;
  }
}

@Injectable()
export class StorageProvider {
  storage: Storage;

  constructor() {
    this.storage = new Storage(SqlStorage, { name: 'interviewer.db' });
    this.storage.query('CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT UNIQUE)');
  }

  public get() {
    return new Promise(resolve => {
      this.storage.query('SELECT * FROM questions')
      .then(({res}) => {
        let questions: Array<Question> = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            let item = res.rows.item(i);
            questions.push(new Question(item.question, item.id));
          }
        }
        resolve(questions);
      });
    })
  }

  public create(q: Question) {
    let sql = 'INSERT OR IGNORE INTO questions (question) VALUES (?)';
    return this.storage.query(sql, [q.question]);
  }

  public update(q: Question) {
    let sql = 'UPDATE questions SET question = \"' + q.question + '\" WHERE id = \"' + q.id + '\"';
    this.storage.query(sql);
  }

  public remove(q: Question) {
    let sql = 'DELETE FROM questions WHERE id = \"' + q.id + '\"';
    this.storage.query(sql);
  }

  public clear() {
    let sql = 'DELETE FROM questions';
    this.storage.query(sql);
  }

  public getKV(key: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(key).then(data => resolve(data));
    })
  }

  public setKV(key: string, value: any) {
    this.storage.set(key, value);
  }

  public removeKV(key: string) {
    this.storage.remove(key).then(({res}) => res);
  }

  public clearKV() {
    this.storage.clear().then(({res}) => res);
  }
}
