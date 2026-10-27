<template>
  <div class="home flex flex-col min-h-screen">
    <PageMainSiteHeader />
    <UMain>
      <slot />
    </UMain>
    <PageMainSiteFooter />
  </div>
</template>
