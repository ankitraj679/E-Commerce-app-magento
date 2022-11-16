/** @format */

import EventEmitter from "@services/AppEventEmitter";

const closeModalLayout = () => EventEmitter.emit("modal.layout.close");

const openModalLayout = () => EventEmitter.emit("modal.layout.open");
const onOpenModalLayout = (func) =>
  EventEmitter.addEventListener("modal.layout.open", func);

// revemo
const openModalReview = (product) =>
  EventEmitter.emit("modal.review.open", product);
const closeModalReview = () => EventEmitter.emit("modal.review.close");
const onOpenModalReview = (func) =>
  EventEmitter.addEventListener("modal.review.open", func);
const onCloseModalReview = (func) =>
  EventEmitter.addEventListener("modal.review.close", func);

const onLogout = (func) =>
  EventEmitter.addEventListener("modal.logout", func);
const onRemoveLogout = () =>
  EventEmitter.removeEventListener("modal.logout");
const logout = () => EventEmitter.emit("modal.logout");

export default {
  openModalLayout,
  closeModalLayout,
  onOpenModalLayout,
  // review
  openModalReview,
  closeModalReview,
  onOpenModalReview,
  onCloseModalReview,
  onLogout,
  onRemoveLogout,
  logout
};
