import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  imports: [CommonModule]
})
export class ArticleListComponent implements OnInit, OnDestroy {
  @Input() selectedCategoryName: string = '';
  @Input() searchTerm: string = '';
  articles: Article[] = [];
  displayCount = 10;
  isLoading = false;
  loadStep = 10;
  autoLoadLimit = 30;

  // Modal chi tiết bài báo
  showModal = false;
  selectedArticle?: Article;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles(0, 100).subscribe((data: Article[]) => {
      if (data && data.length > 0) {
        // Xử lý description ngắn và gán url làm image nếu có
        data.forEach(article => {
          article.description = article.content.slice(0, 120) + '...';
        });
        // Sắp xếp theo publishedAt giảm dần (bài mới lên đầu)
        this.articles = data.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        console.log('DATA:', data);
      }
    });
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  get canLoadMore(): boolean {
    return this.displayCount < this.filteredArticles().length;
  }

  onScroll() {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
      if (this.canLoadMore && !this.isLoading && this.displayCount < this.autoLoadLimit) {
        this.loadMore(true);
      }
    }
  }

  loadMore(auto = false) {
    if (this.isLoading) return;
    this.isLoading = true;
    setTimeout(() => {
      if (auto && this.displayCount + this.loadStep > this.autoLoadLimit) {
        this.displayCount = this.autoLoadLimit;
      } else {
        this.displayCount += this.loadStep;
      }
      this.isLoading = false;
    }, auto ? 1200 : 500);
  }

  filteredArticles(): Article[] {
    let filtered = this.articles;
    if (this.selectedCategoryName) {
      filtered = filtered.filter(a => a.categoryName === this.selectedCategoryName);
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(term) ||
        a.content.toLowerCase().includes(term) ||
        (a.description && a.description.toLowerCase().includes(term))
      );
    }
    return filtered;
  }

  // Hiển thị modal chi tiết bài báo
  onArticleClick(id: number) {
    this.articleService.getArticleById(id).subscribe(article => {
      this.selectedArticle = article;
      this.showModal = true;
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedArticle = undefined;
  }
}
