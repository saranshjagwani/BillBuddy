// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Modal,
//   ActivityIndicator,
//   SafeAreaView,
//   Animated,
// } from "react-native";
// import { useAppTheme } from "../../shared/provider/AppThemeProvider";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface AdditionalDetailsPayload {
//   buyingPrice?: number;
//   supplierName?: string;
//   expiryDate?: string;
//   lowStockAlert?: number;
//   notes?: string;
// }

// interface AdditionalDetailsScreenProps {
//   itemId: string;
//   onSave?: (payload: AdditionalDetailsPayload) => Promise<void> | void;
//   onSkip?: () => void;
//   onBack?: () => void;
// }

// // ─── Main Screen ──────────────────────────────────────────────────────────────

// export default function AdditionalDetailsScreen({
//   itemId,
//   onSave,
//   onSkip,
//   onBack,
// }: AdditionalDetailsScreenProps) {
//   const { theme } = useAppTheme();
//   const colors = theme.colors;

//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const [buyingPrice, setBuyingPrice] = useState("");
//   const [supplierName, setSupplierName] = useState("");
//   const [expiryDate, setExpiryDate] = useState(""); // YYYY-MM-DD
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [lowStockAlert, setLowStockAlert] = useState("");
//   const [notes, setNotes] = useState("");

//   function clearError(field: string) {
//     if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
//   }

//   function validate(): boolean {
//     const newErrors: Record<string, string> = {};

//     if (buyingPrice && (isNaN(Number(buyingPrice)) || Number(buyingPrice) < 0)) {
//       newErrors.buyingPrice = "Enter a valid buying price";
//     }
//     if (expiryDate && !isValidDate(expiryDate)) {
//       newErrors.expiryDate = "Enter a future expiry date";
//     }
//     if (
//       lowStockAlert &&
//       (isNaN(Number(lowStockAlert)) || Number(lowStockAlert) < 0)
//     ) {
//       newErrors.lowStockAlert = "Enter a valid quantity";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }

//   function buildPayload(): AdditionalDetailsPayload {
//     const payload: AdditionalDetailsPayload = {};
//     if (buyingPrice.trim()) payload.buyingPrice = Number(buyingPrice.trim());
//     if (supplierName.trim()) payload.supplierName = supplierName.trim();
//     if (expiryDate) payload.expiryDate = expiryDate;
//     if (lowStockAlert.trim()) payload.lowStockAlert = Number(lowStockAlert.trim());
//     if (notes.trim()) payload.notes = notes.trim();
//     return payload;
//   }

//   async function handleSave() {
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       await onSave?.(buildPayload());
//     } catch (err) {
//       // console.log("AdditionalDetails error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const hasAnyValue =
//     buyingPrice || supplierName || expiryDate || lowStockAlert || notes;

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         {/* Header */}
//         <View
//           style={[
//             styles.header,
//             {
//               borderBottomColor: colors.border,
//               backgroundColor: colors.background,
//             },
//           ]}
//         >
//           {onBack ? (
//             <TouchableOpacity onPress={onBack} style={styles.sideSlot}>
//               <Text style={[styles.backText, { color: colors.primary }]}>
//                 ← Back
//               </Text>
//             </TouchableOpacity>
//           ) : (
//             <View style={styles.sideSlot} />
//           )}
//           <View style={styles.headerCenter}>
//             <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
//               More Details
//             </Text>
//             <Text
//               style={[styles.headerSubtitle, { color: colors.textSecondary }]}
//             >
//               All fields are optional
//             </Text>
//           </View>
//           <TouchableOpacity onPress={onSkip} style={styles.sideSlot}>
//             <Text style={[styles.skipText, { color: colors.textSecondary }]}>
//               Skip
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Progress hint */}
//         <View
//           style={[
//             styles.progressBanner,
//             { backgroundColor: colors.primary + "0D", borderBottomColor: colors.primary + "22" },
//           ]}
//         >
//           <Text style={styles.progressDot}>✦</Text>
//           <Text style={[styles.progressText, { color: colors.primary }]}>
//             Step 2 of 2 — Add extra info to manage your stock better
//           </Text>
//         </View>

//         <ScrollView
//           contentContainerStyle={[
//             styles.scrollContent,
//             { backgroundColor: colors.background },
//           ]}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Buying Price */}
//           <FieldCard
//             icon="💰"
//             label="Buying Price"
//             hint="Your cost per unit from supplier"
//             colors={colors}
//             error={errors.buyingPrice}
//             badge="Profit Tracking"
//           >
//             <View
//               style={[
//                 styles.priceWrapper,
//                 {
//                   borderColor: errors.buyingPrice ? colors.error : colors.border,
//                   backgroundColor: colors.surface,
//                 },
//               ]}
//             >
//               <Text style={[styles.rupee, { color: colors.textSecondary }]}>
//                 ₹
//               </Text>
//               <TextInput
//                 style={[styles.priceInput, { color: colors.textPrimary }]}
//                 placeholder="0.00"
//                 placeholderTextColor={colors.textSecondary}
//                 keyboardType="decimal-pad"
//                 value={buyingPrice}
//                 onChangeText={(v) => {
//                   setBuyingPrice(v);
//                   clearError("buyingPrice");
//                 }}
//               />
//               <Text style={[styles.perUnit, { color: colors.textSecondary }]}>
//                 per unit
//               </Text>
//             </View>
//           </FieldCard>

//           {/* Supplier Name */}
//           <FieldCard
//             icon="🏭"
//             label="Supplier Name"
//             hint="Who supplies this item to you?"
//             colors={colors}
//           >
//             <TextInput
//               style={[
//                 styles.textInput,
//                 {
//                   borderColor: colors.border,
//                   backgroundColor: colors.surface,
//                   color: colors.textPrimary,
//                 },
//               ]}
//               placeholder="e.g. Ramesh Distributors"
//               placeholderTextColor={colors.textSecondary}
//               value={supplierName}
//               onChangeText={setSupplierName}
//               returnKeyType="next"
//             />
//           </FieldCard>

//           {/* Expiry Date */}
//           <FieldCard
//             icon="📅"
//             label="Expiry Date"
//             hint="Only for perishable or dated items"
//             colors={colors}
//             error={errors.expiryDate}
//           >
//             <TouchableOpacity
//               style={[
//                 styles.dateBtn,
//                 {
//                   borderColor: errors.expiryDate ? colors.error : colors.border,
//                   backgroundColor: colors.surface,
//                 },
//               ]}
//               onPress={() => setShowDatePicker(true)}
//               activeOpacity={0.7}
//             >
//               <Text
//                 style={[
//                   styles.dateBtnText,
//                   {
//                     color: expiryDate
//                       ? colors.textPrimary
//                       : colors.textSecondary,
//                     fontWeight: expiryDate ? "600" : "400",
//                   },
//                 ]}
//               >
//                 {expiryDate
//                   ? formatDateDisplay(expiryDate)
//                   : "Select expiry date"}
//               </Text>
//               <View style={styles.dateRight}>
//                 {expiryDate ? (
//                   <TouchableOpacity
//                     onPress={() => {
//                       setExpiryDate("");
//                       clearError("expiryDate");
//                     }}
//                     hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                   >
//                     <Text
//                       style={[styles.clearIcon, { color: colors.textSecondary }]}
//                     >
//                       ✕
//                     </Text>
//                   </TouchableOpacity>
//                 ) : (
//                   <Text style={[styles.calIcon, { color: colors.primary }]}>
//                     📆
//                   </Text>
//                 )}
//               </View>
//             </TouchableOpacity>
//           </FieldCard>

//           {/* Low Stock Alert */}
//           <FieldCard
//             icon="🔔"
//             label="Low Stock Alert"
//             hint="Get notified when stock falls below this quantity"
//             colors={colors}
//             error={errors.lowStockAlert}
//             badge="Smart Alert"
//           >
//             <View style={styles.alertRow}>
//               <View
//                 style={[
//                   styles.alertInputWrapper,
//                   {
//                     borderColor: errors.lowStockAlert
//                       ? colors.error
//                       : colors.border,
//                     backgroundColor: colors.surface,
//                   },
//                 ]}
//               >
//                 <TextInput
//                   style={[styles.alertInput, { color: colors.textPrimary }]}
//                   placeholder="e.g. 10"
//                   placeholderTextColor={colors.textSecondary}
//                   keyboardType="numeric"
//                   value={lowStockAlert}
//                   onChangeText={(v) => {
//                     setLowStockAlert(v);
//                     clearError("lowStockAlert");
//                   }}
//                 />
//                 <Text
//                   style={[styles.unitLabel, { color: colors.textSecondary }]}
//                 >
//                   units
//                 </Text>
//               </View>
//               {/* Quick presets */}
//               <View style={styles.presets}>
//                 {["5", "10", "20"].map((preset) => (
//                   <TouchableOpacity
//                     key={preset}
//                     style={[
//                       styles.preset,
//                       {
//                         borderColor:
//                           lowStockAlert === preset
//                             ? colors.primary
//                             : colors.border,
//                         backgroundColor:
//                           lowStockAlert === preset
//                             ? colors.primary + "14"
//                             : colors.surface,
//                       },
//                     ]}
//                     onPress={() => {
//                       setLowStockAlert(preset);
//                       clearError("lowStockAlert");
//                     }}
//                   >
//                     <Text
//                       style={[
//                         styles.presetText,
//                         {
//                           color:
//                             lowStockAlert === preset
//                               ? colors.primary
//                               : colors.textSecondary,
//                           fontWeight:
//                             lowStockAlert === preset ? "700" : "400",
//                         },
//                       ]}
//                     >
//                       {preset}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </FieldCard>

//           {/* Notes */}
//           <FieldCard
//             icon="📝"
//             label="Notes"
//             hint="Any extra info — fast moving, seasonal, fragile, etc."
//             colors={colors}
//           >
//             <TextInput
//               style={[
//                 styles.notesInput,
//                 {
//                   borderColor: colors.border,
//                   backgroundColor: colors.surface,
//                   color: colors.textPrimary,
//                 },
//               ]}
//               placeholder="e.g. Fast moving item, handle with care..."
//               placeholderTextColor={colors.textSecondary}
//               value={notes}
//               onChangeText={setNotes}
//               multiline
//               numberOfLines={3}
//               textAlignVertical="top"
//             />
//             <Text
//               style={[styles.charCount, { color: colors.textSecondary }]}
//             >
//               {notes.length} / 200
//             </Text>
//           </FieldCard>

//           {/* Bottom spacer */}
//           <View style={{ height: 8 }} />
//         </ScrollView>

//         {/* Footer */}
//         <View
//           style={[
//             styles.footer,
//             {
//               backgroundColor: colors.background,
//               borderTopColor: colors.border,
//             },
//           ]}
//         >
//           {/* Skip row */}
//           <TouchableOpacity
//             style={styles.skipRow}
//             onPress={onSkip}
//             activeOpacity={0.6}
//           >
//             <Text
//               style={[styles.skipRowText, { color: colors.textSecondary }]}
//             >
//               Skip — I'll fill this later
//             </Text>
//           </TouchableOpacity>

//           {/* Save button */}
//           <TouchableOpacity
//             style={[
//               styles.saveBtn,
//               {
//                 backgroundColor: hasAnyValue ? colors.primary : colors.surface,
//                 borderColor: hasAnyValue ? colors.primary : colors.border,
//                 opacity: loading ? 0.85 : 1,
//               },
//             ]}
//             onPress={handleSave}
//             disabled={loading}
//             activeOpacity={0.88}
//           >
//             {loading ? (
//               <ActivityIndicator
//                 color={hasAnyValue ? "#FFFFFF" : colors.textSecondary}
//                 size="small"
//               />
//             ) : (
//               <>
//                 <Text
//                   style={[
//                     styles.saveBtnText,
//                     {
//                       color: hasAnyValue ? "#FFFFFF" : colors.textSecondary,
//                     },
//                   ]}
//                 >
//                   Save & Finish
//                 </Text>
//                 <Text style={styles.saveBtnIcon}>→</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Date Picker */}
//       <DatePickerModal
//         visible={showDatePicker}
//         value={expiryDate}
//         onConfirm={(date) => {
//           setExpiryDate(date);
//           clearError("expiryDate");
//         }}
//         onClose={() => setShowDatePicker(false)}
//         colors={colors}
//       />
//     </SafeAreaView>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   headerCenter: {
//     alignItems: "center",
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     letterSpacing: -0.3,
//   },
//   headerSubtitle: {
//     fontSize: 11,
//     marginTop: 2,
//   },
//   sideSlot: {
//     width: 64,
//   },
//   backText: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   skipText: {
//     fontSize: 14,
//     fontWeight: "500",
//     textAlign: "right",
//   },

//   // Progress banner
//   progressBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     gap: 8,
//   },
//   progressDot: {
//     fontSize: 10,
//     color: "#1E63D5",
//   },
//   progressText: {
//     fontSize: 12,
//     fontWeight: "500",
//     flex: 1,
//   },

//   scrollContent: {
//     padding: 16,
//     paddingTop: 20,
//   },

//   // Price field
//   priceWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 48,
//   },
//   rupee: {
//     fontSize: 16,
//     marginRight: 4,
//   },
//   priceInput: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: "500",
//     paddingVertical: 0,
//     height: 46,
//   },
//   perUnit: {
//     fontSize: 12,
//     marginLeft: 4,
//   },

//   // Text input
//   textInput: {
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 13,
//     fontSize: 15,
//   },

//   // Date
//   dateBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 13,
//   },
//   dateBtnText: {
//     fontSize: 15,
//     flex: 1,
//   },
//   dateRight: {
//     marginLeft: 8,
//   },
//   clearIcon: {
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   calIcon: {
//     fontSize: 16,
//   },

//   // Low stock
//   alertRow: {
//     gap: 12,
//   },
//   alertInputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 48,
//   },
//   alertInput: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: "500",
//     paddingVertical: 0,
//     height: 46,
//   },
//   unitLabel: {
//     fontSize: 13,
//     marginLeft: 4,
//   },
//   presets: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   preset: {
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//   },
//   presetText: {
//     fontSize: 14,
//   },

//   // Notes
//   notesInput: {
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingTop: 12,
//     paddingBottom: 12,
//     fontSize: 14,
//     lineHeight: 21,
//     minHeight: 90,
//   },
//   charCount: {
//     fontSize: 11,
//     textAlign: "right",
//     marginTop: 6,
//   },

//   // Footer
//   footer: {
//     padding: 16,
//     paddingBottom: Platform.OS === "ios" ? 8 : 16,
//     borderTopWidth: 1,
//     gap: 10,
//   },
//   skipRow: {
//     alignItems: "center",
//     paddingVertical: 4,
//   },
//   skipRowText: {
//     fontSize: 13,
//     fontWeight: "500",
//     textDecorationLine: "underline",
//   },
//   saveBtn: {
//     borderWidth: 1.5,
//     borderRadius: 14,
//     paddingVertical: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 8,
//     shadowColor: "#1E63D5",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   saveBtnText: {
//     fontSize: 16,
//     fontWeight: "700",
//     letterSpacing: 0.2,
//   },
//   saveBtnIcon: {
//     fontSize: 16,
//     color: "#FFFFFF",
//   },
// });

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function formatDateDisplay(raw: string): string {
//   // raw is YYYY-MM-DD, show as DD / MM / YYYY
//   const [y, m, d] = raw.split("-");
//   if (!y || !m || !d) return raw;
//   return `${d} / ${m} / ${y}`;
// }

// function isValidDate(val: string): boolean {
//   if (!val) return true;
//   const regex = /^\d{4}-\d{2}-\d{2}$/;
//   if (!regex.test(val)) return false;
//   const date = new Date(val);
//   return !isNaN(date.getTime()) && date > new Date();
// }

// // ─── Date Picker Modal ────────────────────────────────────────────────────────

// interface DatePickerProps {
//   visible: boolean;
//   value: string; // YYYY-MM-DD
//   onConfirm: (date: string) => void;
//   onClose: () => void;
//   colors: ReturnType<typeof useAppTheme>["theme"]["colors"];
// }

// function DatePickerModal({
//   visible,
//   value,
//   onConfirm,
//   onClose,
//   colors,
// }: DatePickerProps) {
//   const today = new Date();
//   const initYear = value
//     ? parseInt(value.split("-")[0])
//     : today.getFullYear();
//   const initMonth = value
//     ? parseInt(value.split("-")[1]) - 1
//     : today.getMonth();
//   const initDay = value ? parseInt(value.split("-")[2]) : today.getDate();

//   const [year, setYear] = useState(initYear);
//   const [month, setMonth] = useState(initMonth);
//   const [day, setDay] = useState(initDay);

//   const MONTHS = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
//   ];

//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//   const months = MONTHS.map((m, i) => ({ label: m, value: i }));
//   const years = Array.from({ length: 20 }, (_, i) => today.getFullYear() + i);

//   function handleConfirm() {
//     const safeDay = Math.min(day, daysInMonth);
//     const mm = String(month + 1).padStart(2, "0");
//     const dd = String(safeDay).padStart(2, "0");
//     onConfirm(`${year}-${mm}-${dd}`);
//     onClose();
//   }

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <TouchableOpacity
//         style={dpStyles.overlay}
//         activeOpacity={1}
//         onPress={onClose}
//       >
//         <TouchableOpacity
//           activeOpacity={1}
//           style={[
//             dpStyles.sheet,
//             { backgroundColor: colors.card, borderColor: colors.border },
//           ]}
//         >
//           {/* Handle */}
//           <View
//             style={[dpStyles.handle, { backgroundColor: colors.border }]}
//           />
//           <Text style={[dpStyles.title, { color: colors.textPrimary }]}>
//             Select Expiry Date
//           </Text>

//           <View style={dpStyles.pickerRow}>
//             {/* Day */}
//             <View style={dpStyles.pickerCol}>
//               <Text style={[dpStyles.pickerLabel, { color: colors.textSecondary }]}>
//                 Day
//               </Text>
//               <ScrollView
//                 style={[dpStyles.scroll, { borderColor: colors.border }]}
//                 showsVerticalScrollIndicator={false}
//               >
//                 {days.map((d) => (
//                   <TouchableOpacity
//                     key={d}
//                     style={[
//                       dpStyles.pickerItem,
//                       day === d && { backgroundColor: colors.primary + "18" },
//                     ]}
//                     onPress={() => setDay(d)}
//                   >
//                     <Text
//                       style={[
//                         dpStyles.pickerItemText,
//                         {
//                           color: day === d ? colors.primary : colors.textPrimary,
//                           fontWeight: day === d ? "700" : "400",
//                         },
//                       ]}
//                     >
//                       {String(d).padStart(2, "0")}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>

//             {/* Month */}
//             <View style={[dpStyles.pickerCol, { flex: 2 }]}>
//               <Text style={[dpStyles.pickerLabel, { color: colors.textSecondary }]}>
//                 Month
//               </Text>
//               <ScrollView
//                 style={[dpStyles.scroll, { borderColor: colors.border }]}
//                 showsVerticalScrollIndicator={false}
//               >
//                 {months.map((m) => (
//                   <TouchableOpacity
//                     key={m.value}
//                     style={[
//                       dpStyles.pickerItem,
//                       month === m.value && {
//                         backgroundColor: colors.primary + "18",
//                       },
//                     ]}
//                     onPress={() => setMonth(m.value)}
//                   >
//                     <Text
//                       style={[
//                         dpStyles.pickerItemText,
//                         {
//                           color:
//                             month === m.value
//                               ? colors.primary
//                               : colors.textPrimary,
//                           fontWeight: month === m.value ? "700" : "400",
//                         },
//                       ]}
//                     >
//                       {m.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>

//             {/* Year */}
//             <View style={dpStyles.pickerCol}>
//               <Text style={[dpStyles.pickerLabel, { color: colors.textSecondary }]}>
//                 Year
//               </Text>
//               <ScrollView
//                 style={[dpStyles.scroll, { borderColor: colors.border }]}
//                 showsVerticalScrollIndicator={false}
//               >
//                 {years.map((y) => (
//                   <TouchableOpacity
//                     key={y}
//                     style={[
//                       dpStyles.pickerItem,
//                       year === y && { backgroundColor: colors.primary + "18" },
//                     ]}
//                     onPress={() => setYear(y)}
//                   >
//                     <Text
//                       style={[
//                         dpStyles.pickerItemText,
//                         {
//                           color: year === y ? colors.primary : colors.textPrimary,
//                           fontWeight: year === y ? "700" : "400",
//                         },
//                       ]}
//                     >
//                       {y}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>

//           {/* Actions */}
//           <View style={dpStyles.actions}>
//             <TouchableOpacity
//               style={[dpStyles.cancelBtn, { borderColor: colors.border }]}
//               onPress={onClose}
//             >
//               <Text style={[dpStyles.cancelBtnText, { color: colors.textSecondary }]}>
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[dpStyles.confirmBtn, { backgroundColor: colors.primary }]}
//               onPress={handleConfirm}
//             >
//               <Text style={dpStyles.confirmBtnText}>Confirm</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </Modal>
//   );
// }

// const dpStyles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   sheet: {
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     borderWidth: 1,
//     padding: 20,
//     paddingBottom: 32,
//   },
//   handle: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     alignSelf: "center",
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: "700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   pickerRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 20,
//   },
//   pickerCol: {
//     flex: 1,
//   },
//   pickerLabel: {
//     fontSize: 11,
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: 0.8,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   scroll: {
//     height: 180,
//     borderWidth: 1,
//     borderRadius: 12,
//   },
//   pickerItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 4,
//     borderRadius: 8,
//     marginHorizontal: 4,
//     marginVertical: 1,
//   },
//   pickerItemText: {
//     fontSize: 14,
//     textAlign: "center",
//   },
//   actions: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   cancelBtn: {
//     flex: 1,
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   cancelBtnText: {
//     fontSize: 15,
//     fontWeight: "500",
//   },
//   confirmBtn: {
//     flex: 1,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   confirmBtnText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "700",
//   },
// });

// // ─── Field Card ───────────────────────────────────────────────────────────────

// interface FieldCardProps {
//   icon: string;
//   label: string;
//   hint: string;
//   children: React.ReactNode;
//   colors: ReturnType<typeof useAppTheme>["theme"]["colors"];
//   error?: string;
//   badge?: string;
// }

// function FieldCard({
//   icon,
//   label,
//   hint,
//   children,
//   colors,
//   error,
//   badge,
// }: FieldCardProps) {
//   return (
//     <View
//       style={[
//         cardStyles.card,
//         {
//           backgroundColor: colors.card,
//           borderColor: error ? colors.error : colors.border,
//           shadowColor: colors.primary,
//         },
//       ]}
//     >
//       <View style={cardStyles.cardHeader}>
//         <View style={[cardStyles.iconBubble, { backgroundColor: colors.primary + "14" }]}>
//           <Text style={cardStyles.iconText}>{icon}</Text>
//         </View>
//         <View style={cardStyles.labelGroup}>
//           <View style={cardStyles.labelRow}>
//             <Text style={[cardStyles.cardLabel, { color: colors.textPrimary }]}>
//               {label}
//             </Text>
//             {badge && (
//               <View
//                 style={[
//                   cardStyles.badge,
//                   { backgroundColor: colors.primary + "14" },
//                 ]}
//               >
//                 <Text style={[cardStyles.badgeText, { color: colors.primary }]}>
//                   {badge}
//                 </Text>
//               </View>
//             )}
//           </View>
//           <Text style={[cardStyles.cardHint, { color: colors.textSecondary }]}>
//             {hint}
//           </Text>
//         </View>
//       </View>
//       <View style={cardStyles.cardInput}>{children}</View>
//       {error ? (
//         <Text style={[cardStyles.errorText, { color: colors.error }]}>
//           {error}
//         </Text>
//       ) : null}
//     </View>
//   );
// }

// const cardStyles = StyleSheet.create({
//   card: {
//     borderWidth: 1,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 14,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 14,
//     gap: 12,
//   },
//   iconBubble: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconText: {
//     fontSize: 18,
//   },
//   labelGroup: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   labelRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     flexWrap: "wrap",
//   },
//   cardLabel: {
//     fontSize: 15,
//     fontWeight: "700",
//     letterSpacing: -0.2,
//   },
//   cardHint: {
//     fontSize: 12,
//     marginTop: 2,
//     lineHeight: 17,
//   },
//   badge: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 20,
//   },
//   badgeText: {
//     fontSize: 10,
//     fontWeight: "700",
//     letterSpacing: 0.5,
//     textTransform: "uppercase",
//   },
//   cardInput: {},
//   errorText: {
//     fontSize: 12,
//     marginTop: 8,
//   },
// });
