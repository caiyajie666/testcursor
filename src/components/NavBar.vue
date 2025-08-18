<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="fas fa-globe me-2"></i>PinguBuy
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav me-auto">
          <router-link class="nav-link" to="/" exact-active-class="active">首页</router-link>
          <a class="nav-link" href="#estimate" @click="scrollToSection('estimate')">估价</a>
          <a class="nav-link" href="#order" @click="scrollToSection('order')">转单</a>
          <a class="nav-link" href="#purchase" @click="scrollToSection('purchase')">填单购买</a>
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              服务
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#estimate" @click="scrollToSection('estimate')">
                <i class="fas fa-calculator me-2"></i>价格估算
              </a></li>
              <li><a class="dropdown-item" href="#order" @click="scrollToSection('order')">
                <i class="fas fa-exchange-alt me-2"></i>订单转发
              </a></li>
              <li><a class="dropdown-item" href="#shipping">
                <i class="fas fa-shipping-fast me-2"></i>国际物流
              </a></li>
              <li><a class="dropdown-item" href="#support">
                <i class="fas fa-headset me-2"></i>客户支持
              </a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#guide">
                <i class="fas fa-book me-2"></i>新手指南
              </a></li>
            </ul>
          </div>
          <a class="nav-link" href="#help">帮助中心</a>
        </div>
        
        <!-- 搜索框 -->
        <form class="d-flex me-3" role="search" @submit.prevent="searchProducts">
          <input 
            class="form-control me-2" 
            type="search" 
            placeholder="搜索中国商品..." 
            v-model="searchQuery"
          >
          <button class="btn btn-outline-light" type="submit">
            <i class="fas fa-search"></i>
          </button>
        </form>
        
        <!-- 用户菜单 -->
        <div class="navbar-nav">
          <router-link class="nav-link position-relative" to="/cart">
            <i class="fas fa-shopping-cart"></i>
            <span class="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle" v-if="cartCount > 0">
              {{ cartCount }}
            </span>
          </router-link>
          <router-link v-if="!user" class="nav-link" to="/login">
            <i class="fas fa-sign-in-alt me-1"></i>登录
          </router-link>
          <router-link v-if="!user" class="nav-link" to="/register">
            <i class="fas fa-user-plus me-1"></i>注册
          </router-link>
          <div v-if="user" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="fas fa-user me-1"></i>{{ user.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#profile">
                <i class="fas fa-user-circle me-2"></i>个人中心
              </a></li>
              <li><a class="dropdown-item" href="#orders">
                <i class="fas fa-box me-2"></i>我的订单
              </a></li>
              <li><a class="dropdown-item" href="#favorites">
                <i class="fas fa-heart me-2"></i>我的收藏
              </a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click="logout">
                <i class="fas fa-sign-out-alt me-2"></i>退出登录
              </a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useMainStore } from '../stores'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const store = useMainStore()
    const router = useRouter()
    const searchQuery = ref('')
    
    const user = computed(() => store.user)
    const cartCount = computed(() => store.cartCount)
    
    const scrollToSection = (sectionId) => {
      // 如果不在首页，先跳转到首页
      if (router.currentRoute.value.path !== '/') {
        router.push('/').then(() => {
          setTimeout(() => {
            const element = document.getElementById(sectionId)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }, 100)
        })
      } else {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    
    const searchProducts = () => {
      if (searchQuery.value.trim()) {
        router.push({ name: 'Products', query: { search: searchQuery.value } })
      }
    }
    
    const logout = () => {
      store.logout()
      router.push('/')
    }
    
    return {
      user,
      cartCount,
      searchQuery,
      scrollToSection,
      searchProducts,
      logout
    }
  }
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  transform: translateY(-2px);
}

.dropdown-menu {
  border: none;
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  border-radius: 10px;
}

.dropdown-item {
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

@media (max-width: 991px) {
  .navbar-nav {
    margin-top: 1rem;
  }
  
  .dropdown-menu {
    border: 1px solid rgba(255,255,255,0.2);
    background-color: rgba(255,255,255,0.1);
  }
  
  .dropdown-item {
    color: rgba(255,255,255,0.9);
  }
  
  .dropdown-item:hover {
    background-color: rgba(255,255,255,0.2);
    color: white;
  }
}
</style>