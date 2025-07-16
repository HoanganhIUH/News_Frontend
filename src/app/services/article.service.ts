import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private baseUrl = 'http://localhost:8080/api/articles'; // URL backend

  constructor(private http: HttpClient) {}

  getArticles(page: number, size: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`);
  }
}
